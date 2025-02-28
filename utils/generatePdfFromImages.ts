import * as Print from "expo-print";
import { manipulateAsync } from "expo-image-manipulator";
import type { PageSize } from "@/types/PageSize";
import { PageSizes } from "@/constants/PageSizes";

/**
 * Generates a PDF document from an array of image URIs with specified page size.
 * 
 * This function performs the following steps:
 * 1. Converts all input images to base64 format
 * 2. Creates an HTML template with proper page styling
 * 3. Embeds the images in the HTML with page breaks between them
 * 4. Generates a PDF file with the specified page dimensions
 * 
 * @param uris - Array of image URIs to be converted into PDF pages
 * @param pageSize - The desired page size for the PDF (e.g., 'A4', 'LETTER')
 * @returns Promise that resolves to the generated PDF file information
 */
export const generatePdfFromImages = async (uris: string[], pageSize: PageSize) => {
  // Convert all images to base64 format for HTML embedding
  const images = await Promise.all(uris.map((uri) => manipulateAsync(uri, [], { base64: true })));

  // Create HTML template with CSS styling for proper page layout
  const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            /* Remove default page margins for Android */
            @page {
              margin: 0;
            }
            /* Reset default styles and use border-box sizing */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            /* Ensure full viewport coverage */
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            /* Style for individual pages with page breaks */
            .page {
              width: 100%;
              height: 100%;
              page-break-after: always;
            }
            /* Remove page break after last page */
            .page:last-child {
              page-break-after: avoid;
            }
            /* Ensure images fill their containers while maintaining aspect ratio */
            img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          ${images
            .map(
              (image) => `
            <div class="page">
              <img src="data:image/jpeg;base64,${image.base64}" />
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

  // Generate PDF file with specified dimensions and no margins
  return Print.printToFileAsync({
    html,
    base64: false,
    height: PageSizes[pageSize].height,
    width: PageSizes[pageSize].width,
    // Remove default page margins for iOS
    margins: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  });
};
