import * as Print from "expo-print";
import { manipulateAsync } from "expo-image-manipulator";
import { generatePdfFromImages } from "@/utils/generatePdfFromImages";
import { PageSizes } from "@/constants/PageSizes";
import type { PageSize } from "@/types/PageSize";

// Mock expo-print
jest.mock("expo-print", () => ({
  printToFileAsync: jest.fn(),
}));

// Mock expo-image-manipulator
jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn(),
}));

describe("generatePdfFromImages", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock manipulateAsync to return base64 images
    (manipulateAsync as jest.Mock).mockImplementation((uri) =>
      Promise.resolve({
        base64: `mock-base64-for-${uri}`,
      })
    );
    // Mock printToFileAsync to return a file URI
    (Print.printToFileAsync as jest.Mock).mockResolvedValue({
      uri: "generated-pdf-file.pdf",
    });
  });

  test("generates PDF with correct configuration for A4 size", async () => {
    const imageUris = ["image1.jpg", "image2.jpg"];
    const pageSize: PageSize = "A4";

    const result = await generatePdfFromImages(imageUris, pageSize);

    // Verify image manipulation was called for each image
    expect(manipulateAsync).toHaveBeenCalledTimes(2);
    expect(manipulateAsync).toHaveBeenCalledWith("image1.jpg", [], { base64: true });
    expect(manipulateAsync).toHaveBeenCalledWith("image2.jpg", [], { base64: true });

    // Verify PDF generation was called with correct parameters
    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    const printCall = (Print.printToFileAsync as jest.Mock).mock.calls[0][0];

    // Verify PDF configuration
    expect(printCall).toMatchObject({
      base64: false,
      height: PageSizes[pageSize].height,
      width: PageSizes[pageSize].width,
      margins: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });

    // Verify HTML structure
    expect(printCall.html).toContain("<!DOCTYPE html>");
    expect(printCall.html).toContain('<meta charset="utf-8">');
    expect(printCall.html).toContain("data:image/jpeg;base64,mock-base64-for-image1.jpg");
    expect(printCall.html).toContain("data:image/jpeg;base64,mock-base64-for-image2.jpg");

    // Verify the result
    expect(result).toEqual({ uri: "generated-pdf-file.pdf" });
  });

  test("generates PDF with correct configuration for Letter size", async () => {
    const imageUris = ["image1.jpg"];
    const pageSize: PageSize = "Letter";

    await generatePdfFromImages(imageUris, pageSize);

    // Verify PDF generation was called with correct page size
    const printCall = (Print.printToFileAsync as jest.Mock).mock.calls[0][0];
    expect(printCall).toMatchObject({
      height: PageSizes[pageSize].height,
      width: PageSizes[pageSize].width,
    });
  });

  test("handles empty image array", async () => {
    const imageUris: string[] = [];
    const pageSize: PageSize = "A4";

    await generatePdfFromImages(imageUris, pageSize);

    // Verify no image manipulation was performed
    expect(manipulateAsync).not.toHaveBeenCalled();

    // Verify PDF was still generated (empty document)
    expect(Print.printToFileAsync).toHaveBeenCalled();
    const printCall = (Print.printToFileAsync as jest.Mock).mock.calls[0][0];
    expect(printCall.html).not.toContain("data:image/jpeg;base64");
  });

  test("handles image manipulation failure", async () => {
    const imageUris = ["image1.jpg"];
    const pageSize: PageSize = "A4";

    // Mock image manipulation to fail
    (manipulateAsync as jest.Mock).mockRejectedValueOnce(new Error("Image manipulation failed"));

    await expect(generatePdfFromImages(imageUris, pageSize)).rejects.toThrow();
  });

  test("handles PDF generation failure", async () => {
    const imageUris = ["image1.jpg"];
    const pageSize: PageSize = "A4";

    // Mock PDF generation to fail
    (Print.printToFileAsync as jest.Mock).mockRejectedValueOnce(new Error("PDF generation failed"));

    await expect(generatePdfFromImages(imageUris, pageSize)).rejects.toThrow();
  });

  test("generates PDF with correct CSS styles", async () => {
    const imageUris = ["image1.jpg"];
    const pageSize: PageSize = "A4";

    await generatePdfFromImages(imageUris, pageSize);

    const printCall = (Print.printToFileAsync as jest.Mock).mock.calls[0][0];

    // Verify CSS styles
    expect(printCall.html).toContain("margin: 0");
    expect(printCall.html).toContain("page-break-after: always");
    expect(printCall.html).toContain("object-fit: contain");
    expect(printCall.html).toContain("width: 100%");
    expect(printCall.html).toContain("height: 100%");
  });
});
