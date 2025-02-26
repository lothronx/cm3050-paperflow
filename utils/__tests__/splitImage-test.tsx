import { manipulateAsync } from "expo-image-manipulator";
import { splitImage } from "@/utils/splitImage";
import type { ImageDimensions } from "@/types/ImageDimensions";

// Mock expo-image-manipulator
jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: {
    JPEG: "jpeg",
  },
}));

describe("splitImage and related functions", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (manipulateAsync as jest.Mock).mockImplementation((uri, operations) => {
      // Mock implementation that returns a modified URI based on crop coordinates
      const crop = operations[0].crop;
      return Promise.resolve({
        uri: `cropped-${uri}-x${crop.originX}-y${crop.originY}-w${crop.width}-h${crop.height}`,
      });
    });
  });

  describe("splitImage", () => {
    test("splits image into correct segments based on positions", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions: ImageDimensions = {
        width: 1000,
        height: 2000,
      };
      const positions = [500, 1000, 1500];

      const result = await splitImage(imageUri, actualDimensions, positions);

      // Should create 4 segments (3 from positions + 1 for remainder)
      expect(result).toHaveLength(4);

      // Verify each segment's crop parameters
      expect(result[0]).toBe("cropped-test-image.jpg-x0-y0-w1000-h500");
      expect(result[1]).toBe("cropped-test-image.jpg-x0-y500-w1000-h500");
      expect(result[2]).toBe("cropped-test-image.jpg-x0-y1000-w1000-h500");
      expect(result[3]).toBe("cropped-test-image.jpg-x0-y1500-w1000-h500");

      // Verify manipulateAsync was called correct number of times
      expect(manipulateAsync).toHaveBeenCalledTimes(4);
    });

    test("filters out positions that are too close together", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions: ImageDimensions = {
        width: 1000,
        height: 1000,
      };
      const positions = [100, 105, 200, 205, 300]; // 105 and 205 should be filtered out

      const result = await splitImage(imageUri, actualDimensions, positions);

      expect(result).toHaveLength(4);
      expect(result[0]).toBe("cropped-test-image.jpg-x0-y0-w1000-h100");
      expect(result[1]).toBe("cropped-test-image.jpg-x0-y100-w1000-h100");
      expect(result[2]).toBe("cropped-test-image.jpg-x0-y200-w1000-h100");
      expect(result[3]).toBe("cropped-test-image.jpg-x0-y300-w1000-h700");
    });

    test("handles empty positions array", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions: ImageDimensions = {
        width: 1000,
        height: 1000,
      };
      const positions: number[] = [];

      const result = await splitImage(imageUri, actualDimensions, positions);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("cropped-test-image.jpg-x0-y0-w1000-h1000");
      expect(manipulateAsync).toHaveBeenCalledTimes(1);
    });

    test("handles error from image manipulation", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions: ImageDimensions = {
        width: 1000,
        height: 1000,
      };
      const positions = [500];

      // Mock manipulateAsync to throw an error
      (manipulateAsync as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to split image: Crop failed")
      );

      await expect(splitImage(imageUri, actualDimensions, positions)).rejects.toThrow(
        "Failed to split image: Crop failed"
      );
    });
  });

  describe("Edge cases", () => {
    test("handles positions beyond image height", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions: ImageDimensions = {
        width: 1000,
        height: 1000,
      };
      const positions = [500, 1500]; // 1500 is beyond image height

      const result = await splitImage(imageUri, actualDimensions, positions);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe("cropped-test-image.jpg-x0-y0-w1000-h500");
      expect(result[1]).toBe("cropped-test-image.jpg-x0-y500-w1000-h1000");
    });

    test("handles positions at image boundaries", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions: ImageDimensions = {
        width: 1000,
        height: 1000,
      };
      const positions = [0, 1000]; // Positions at boundaries

      const result = await splitImage(imageUri, actualDimensions, positions);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("cropped-test-image.jpg-x0-y0-w1000-h1000");
    });
  });

  describe("Error handling", () => {
    test("handles non-Error objects in cropImage", async () => {
      const imageUri = "test-image.jpg";
      const cropConfig = {
        originX: 0,
        originY: 0,
        width: 100,
        height: 100,
      };

      // Mock manipulateAsync to throw a non-Error object
      (manipulateAsync as jest.Mock).mockRejectedValueOnce("Some string error");

      await expect(splitImage(imageUri, { width: 100, height: 100 }, [50])).rejects.toThrow(
        "Failed to split image: Failed to crop image: Unknown error"
      );
    });

    test("handles non-Error objects in splitImage", async () => {
      const imageUri = "test-image.jpg";
      const actualDimensions = {
        width: 100,
        height: 100,
      };

      // Mock manipulateAsync to throw a non-Error object
      (manipulateAsync as jest.Mock).mockRejectedValueOnce({ someField: "error" });

      await expect(splitImage(imageUri, actualDimensions, [50])).rejects.toThrow(
        "Failed to split image: Failed to crop image: Unknown error"
      );
    });
  });
});
