# PaperFlow - Split Long Image for Printing

Course: CM3050 Mobile Development

Author: Yue Wu

Date: March 10, 2025

## 1. Concept Development

### 1.1 Background

Long-form text-based images have emerged as a prevalent medium on the internet, especially within the Chinese-speaking online community, driven by three key factors: 1) the widespread support for scrolling screenshots among smartphones in China, 2) the popularity of image stitching software, and 3) the established practice of sharing long visuals.

While this trend reflects user preferences and behaviors, it presents a significant challenge, particularly in the context of printing. For instance, legal professionals often require hard copies of long-image evidence, such as unrolled WeChat chat logs, for court submissions. A thorough search of available applications reveals a gap in the market, as most long-image splitting tools merely segment images into equal parts, risking text truncation and compelling users to engage in cumbersome calculations of the right number of segments for proper printing aspect ratios.

This project proposes a targeted solution to effectively address the long image printing challenge.

### 1.2 Project Overview

PaperFlow redefines how you prepare long images for printing. This app’s main feature is splitting text-based long pictures into A4, Letter, or Legal-sized pages without cutting off any text, all made possible by advanced OCR technology. Ideal for lawyers preparing documentary evidence or anyone handling scrolling screenshot, PaperFlow lets you import images, fine-tune split lines manually, and export print-ready pages with ease.

### 1.3 Core Features

- Image Import

Users can select a long image from the local gallery and set splitting options (proportion and whether to use OCR).

- OCR Text Detection

Uses Baidu OCR API to detect text positions in the image and generate boundary data.

- Automatic Splitting

Automatically generates split regions based on user-selected proportions (A4, Letter, Legal) and OCR results.

- Split Preview

Displays multiple horizontal dashed split lines on the original image, allowing users to adjust the split lines.

- Manual Adjustment

Allows users to add, delete, and adjust split line positions via gestures.

- Preview Interface

Displays split images in a 3\*N grid layout, supporting scrolling through all images.

- Export Functionality

Allows users to save and share the results as images (JPEG) or as a PDF file.

### 1.4 Split Logic

#### 1.4.1 Unlimited Proportion

- No automatic splitting; directly enters the split preview interface.
- Users can manually add, move, or delete split lines.

#### 1.4.2 Fixed Proportion (A4, Letter, Legal)

##### Without OCR

- Automatically splits the long image into multiple pages matching the selected proportion.
- The last page automatically fills blank space to match the proportion.

##### With OCR

- Based on OCR results, ensures no text is truncated while making each split page as close as possible to the selected proportion (equal to or slightly smaller than the proportion).
- The last page automatically fills blank space to match the proportion.

## 2. Wireframing

## 3. User Feedback

The User Feedback section should focus on how you gathered, analyzed, and incorporated feedback from potential users or stakeholders during the development process. This is a critical part of iterative design, as it ensures that your application meets user needs and expectations.

3.1 Gathering Feedback
To gather user feedback, I conducted informal interviews and surveys with target users, including legal professionals, students, and individuals who frequently handle long-form images. The feedback collection process was divided into two phases:

Phase 1: Early Concept Validation
Before starting development, I shared the concept of PaperFlow with a small group of users to validate its necessity and appeal. Most participants expressed frustration with existing tools that fail to preserve text integrity when splitting long images. They also emphasized the importance of manual adjustments for fine-tuning split lines.
Phase 2: Prototype Testing
Once the initial prototype was ready, I invited users to test the app and provide feedback on usability, functionality, and overall experience. Key insights included:
Users appreciated the OCR-based splitting feature but suggested adding visual indicators (e.g., highlighting detected text boundaries) to make the process more transparent.
Some users found the gesture controls intuitive but requested additional tutorials or tooltips for first-time users.
A few participants noted that exporting PDFs could benefit from customizable settings like margins and orientation.
3.2 Incorporating Feedback
Based on the feedback received, I made several improvements to enhance the user experience:

Added an optional "Highlight Text Regions" mode in the preview interface to visualize OCR results.
Included interactive tooltips for gestures and other key features during the onboarding process.
Enhanced the export functionality by allowing users to customize page margins and choose between portrait and landscape orientations.
By actively incorporating user feedback, I ensured that PaperFlow not only addresses the core problem but also provides a seamless and enjoyable user experience.

## 4. Prototyping

The Prototyping section describes the creation and refinement of early versions of your application. This stage involves building functional mockups to test ideas, iterate on designs, and validate technical feasibility.

4.1 Initial Prototype
The initial prototype of PaperFlow focused on implementing the core functionalities: image import, OCR-based text detection, automatic splitting, and basic manual adjustments. Built using React Native and Expo, this version served as a proof of concept to demonstrate the viability of the proposed solution.

Key components of the initial prototype included:

Image Import : Users could upload long images from their device gallery.
OCR Integration : Use Baidu OCR API to detect text positions and generate boundary data.
Automatic Splitting : Implemented logic to divide images into fixed proportions (A4, Letter, Legal), ensuring no text truncation when OCR was enabled.
Manual Adjustments : Basic gesture support allowed users to add, move, or delete split lines.
4.2 Iterative Refinements
After testing the initial prototype, I identified areas for improvement and iterated on the design and functionality:

Improved UI/UX : Redesigned the split preview interface to display dashed lines clearly and introduced a grid layout for better visualization of split pages.
Enhanced Gestures : Expanded gesture support to include pinch-to-zoom and swipe-to-scroll interactions, making manual adjustments smoother and more intuitive.
Performance Optimization : Optimized image processing algorithms to reduce latency, especially for high-resolution images.
4.3 Final Prototype
The final prototype incorporated all refinements and represented a near-complete version of the application. It featured:

A polished user interface with consistent styling and responsive layouts.
Comprehensive functionality, including advanced manual adjustments and customizable export options.
Robust error handling and edge-case management, ensuring stability across various devices and input types.
This prototype was thoroughly tested by users and served as the foundation for the fully developed application.

## 5. Development

## 6. Unit Testing

OCR Call Test:

Split Logic Test:
Tests split results under different proportions.
Tests the impact of OCR results on split lines.

## 7. Evaluation

Innovation & Creativity
