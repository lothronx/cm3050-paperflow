import * as Print from "expo-print";
import { manipulateAsync } from "expo-image-manipulator";
import type { PageSize } from "@/types/PageSize";
import { PageSizes } from "@/constants/PageSizes";

const generatePdfFromImages = async (uris: string[], pageSize: PageSize) => {
  const images = await Promise.all(uris.map((uri) => manipulateAsync(uri, [], { base64: true })));

  const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            .page {
              width: 100%;
              height: 100%;
              page-break-after: always;
            }
            .page:last-child {
              page-break-after: avoid;
            }
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

  return Print.printToFileAsync({
    html,
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
};

export default generatePdfFromImages;
