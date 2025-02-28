PaperFlow: Split Long Image for Printing
Course: CM3050 Mobile Development
Author: Yue Wu
Date: March 10, 2025

## 1. Concept Development
1.1 Background
Long-form text-based images have emerged as a prevalent medium on the internet, especially within the Chinese-speaking online community, driven by three key factors: 1) the widespread support for scrolling screenshots among smartphones in China; 2) the popularity of image stitching applications and article-to-image tools; and 3) the established practice of sharing long pictures instead of links/texts.
While this trend reflects user preferences and behaviours, it presents a significant challenge, particularly in the context of printing. For example, legal professionals often require hard copies of long-image evidence, such as unrolled WeChat chat logs, for court submissions.
A thorough search of available applications reveals a market gap. Current lightweight image-splitting tools only let users divide images into N equal parts, risking text truncation and forcing them to calculate the correct number of segments for proper printing aspect ratios. Alternatively, users must manually create multiple copies of the original image and crop each page individually, which is time-consuming and also makes it difficult to maintain uniform proportions. 
This project proposes a targeted solution to address the long image printing challenge effectively.
1.2 Project Overview
Discover PaperFlow, the handy app that simplifies preparing long images for print. Perfect for lawyers and anyone dealing with scrolling screenshots, PaperFlow allows you to easily import images and automatically split them into A4, Letter, or Legal-sized pages. Fine-tune split lines manually and export your documents in print-ready format with just a few clicks. Experience hassle-free printing like never before!
1.3 Core Features
Image Import
Users can select an image from their local photo library and set splitting options, including page size and auto-split.
Automatic Splitting
Automatically generates split lines based on user-selected proportions (A4, Letter, Legal).
Manual Adjustment
Displays split lines on the original image, enabling users to add, delete, or adjust them manually.
Preview Interface
Shows cropped images in a carousel for users to preview the final result.
Export Functionality
Lets users save the results as images or share them as a single PDF file.

## 2. Wireframing
I did three rounds of wireframing for this project. Each round of wireframe was user-tested and refined based on user feedback.
2.1 Wireframe Version 1
In the initial wireframing round, I designed the app to have three main pages: 1) an image import page, 2) a split workshop page, and 3) a preview and export page. Users can import an image and set splitting options on the Home page, adjust split lines on the Split page, and preview and export the final result on the Preview page. This outlines the first version of the low-fidelity wireframe.

2.2 Wireframe Version 2
Based on the user feedback on Version 1, the following changes were made:
Home Screen
The image upload component has been removed, and its functionality is now integrated with the start button. Once an image is selected, the app will automatically transition to the next screen.  
Due to privacy concerns regarding OCR text detection, the 'Prevent Text Truncation' feature has been removed and replaced with an 'Auto Split' option.  
A small question mark icon has been added next to options to provide users with interactive help. Clicking this icon will open an explanatory popup.  
The app name has been enlarged and repositioned for better visual alignment. A one-line description has been added beneath the app name to clarify its primary functionality.
Split Screen
A loading indicator has been added to improve the user experience during image processing.
Text indicators have been added to explain the gesture-based functionality more clearly.  
A page number indicator has been implemented so users can track which page they are on. 
The drag and delete buttons have been minimised and placed next to each line for easier access.  
The number of bottom buttons has been reduced from three to two.  
UI text has been updated for greater clarity.
Preview Screen  
The share functionality has been moved to the top-right corner to align with iOS design conventions.  
The number of bottom buttons has been reduced to eliminate visual clutter.

2.3 Wireframe Version 3
After more user tests, more updates have been made:
General Changes
The colour palette and font pairing have been selected to ensure consistency across the app.  
Home Screen
Added a background image to evoke the idea of "paper".  
Introduced a language toggle button for switching between Chinese and English.  
Adjusted the UI layout for better user experience.
Split Screen
Enabled image zoom-in and zoom-out functionality.  
Changed the gesture indicator from text to an icon button to reduce text burden.  
Changed the "Back" and "Preview" buttons from text to icons for the similar reason.  
Replaced the loading indicator with a spinner animation (which cannot be seen in the screenshot) for the similar reason.
Minimised the page number indicator and placed it in the middle of the split line to avoid obstructing the image.
Preview Screen
Replaced the grid layout with a carousel for result previews to allow users to view larger images and check for cropping errors without extra click-to-zoom.
Changed the "Back" button from text to an icon for consistency with the split screen.  
Removed the less-wanted "Save PDF to File" and "Share Photos" functionalities to reduce visual and functional clutter.  
Added icons to buttons for better non-text indication.

The final version of wireframes received very positive feedback. The interviewees found the wireframes to be clear and easy to follow, and the user interface was visually appealing and intuitive. This version of wireframes provided a solid foundation for the development of the app.

## 3. User Feedback
 "I gathered user feedback through informal interviews and surveys with target users. Since I work in a business complex filled with law firms, I was able to easily connect with potential users—lawyers—who could test the app."
3.1 Early Concept Validation
Before committing to the app concept, I shared the idea for a crop-long-image-into-paper-size app with a small group of users to assess its necessity and appeal. Most participants expressed frustration with existing tools that either failed to preserve text integrity when splitting long images or were very time-consuming to use. They highlighted the importance of manual adjustments for fine-tuning split lines and emphasised the need for simplicity and efficiency in a user-friendly interface.
3.2 Wireframe Testing
Once the app concept was validated, I began developing wireframes and invited users to provide feedback on the wireframe design and its usability. This feedback was gathered through informal one-on-one interviews. The insights collected led to several important adjustments, which I’ll summarise below:
OCR Text Detection and Privacy Concerns
Initially, I intended to use an online OCR API to detect text positions and thus prevent truncation when splitting images. However, many users expressed concerns about data privacy and requested that the app function fully offline. While I researched local OCR options, I found their performance to be unsatisfactory. After extensive experimentation, I determined that OCR was unnecessary for the tool’s core function. Instead, users can manually adjust the split lines when they cross text, which proved to be a manageable solution. This change simplified the app and alleviated privacy concerns.
Clarity of Functionality
In the first round of testing, many users were confused by certain features. For example, some didn’t understand what the app was supposed to do just by viewing the home page, and others weren’t sure whether the “Reset” button would reset the current operation or all split lines. To address this, I added more text clarifications and visual indications to the UI components. However, in the second round of iteration, I noticed that the added text created a reading burden, so I switched to a more icon-driven design, retaining only the necessary text to maintain clarity while improving visual simplicity.
Avoiding UI Clutter
Another major insight came from observing how users interacted with the app’s interface. In the first round, users struggled to process the five buttons on the Preview page. The layout was visually overwhelming, so in version 2 of the wireframe, I separated the save and share functions, moving the sharing options to the top-right corner to reduce clutter. However, users pointed out that sharing as a PDF is a commonly used function and shouldn’t be nested. As a result, I simplified the UI further, removing the less desired "Share Photos" and "Save as PDF" features and leaving only the two most essential functions: “Save as Photos” and “Share as PDF.”
Reducing Unnecessary Operations
During interviews, I asked test users to vocally walk me through their planned actions to better understand the user flow. Based on their feedback, I combined the “Image Upload” and “Start” actions into a single button to reduce an unnecessary click. Additionally, I changed the result preview from a grid layout to a carousel format, which allowed users to swipe through images without needing to click to enlarge each one. This simplified the navigation process and made the app feel more fluid.
3.3 Testing During Development
As mobile apps can perform differently across devices, I continued gathering feedback during the development stage. I invited users with various devices to test the app and ensure a consistent user experience. This phase was critical for identifying and resolving issues specific to different platforms, especially Android, as I was primarily using an iOS simulator for development. Much of the final stage of development was dedicated to debugging and addressing these device-specific issues. We’ll discuss this further in the development section.
By actively incorporating user feedback at every stage, I ensured that PaperFlow not only addresses the core problem of splitting long images into paper-size pieces but also provides a seamless and enjoyable user experience. The overall user satisfaction rate rose from 5/10 to 9/10. Through iterative testing and refining based on real user input, the app evolved to meet user needs and preferences, resulting in a more intuitive and effective tool. 

## 4. Prototyping
4.1 Technical Feasibility Validation
After validating the app concept, I immediately focused on assessing the technical feasibility of my image-splitting app. Since the core feature of the app is to split long text-based images efficiently into page size without losing text integrity, and my primary audience is Chinese users, I focused on selecting the right OCR tool for the auto-split job.
Online OCR Testing: Baidu OCR API
I began by testing Baidu OCR API, which is the leading OCR service in the Chinese market.  
Pros:
User-friendly API interface  
Fast processing  
High accuracy  
Cons:
Paid service  
Cannot process long images directly—images must first be cropped into shorter segments, which require multiple API calls. This means manually combining the results, making it less efficient.
Offline OCR Testing: Paddle OCR
After receiving user feedback that rejected online services in favour of offline functionality, I turned to local OCR options. I tested Paddle OCR, known for its strong support of Chinese text.
Pros: 
Free  
Lightweight  
Can be deployed entirely offline  
Supports long-image text detection  
Cons:
Fatal design flaw: Paddle OCR is a combination of three core functionalities—text detection, text direction, and text recognition. Ideally, text detection should be independent of recognition, but in practice, when recognition is disabled, text detection becomes inaccurate. Enabling recognition improves accuracy, but the process becomes extremely slow, with text recognition consuming most of the processing time.  
For a 16-page image, the processing time was 30 seconds, which significantly reduced the app’s usability. Despite thorough investigation in the documentation, I couldn’t find a solution. As a result, I decided to abandon this approach.
Shift to Non-OCR Solution
With both online and offline OCR options ruled out, I shifted the focus away from text detection. Instead, I concentrated on splitting images based solely on page size. Users would be able to manually adjust the splits later to avoid text truncation.
This approach was technically feasible. To split an image based on page size without OCR detection, I simply needed the aspect ratios of both the original image and the target page size. Then, I could use basic calculations to create the split lines.
4.2 Initial Prototype
The initial prototype of PaperFlow focused on implementing the core functionalities: image import, automatic splitting based on page size, and basic manual split line adjustments. Built using React Native and Expo, this version served as a proof of concept to demonstrate the viability of the proposed solution.
Key components of the initial prototype included:  
Image Import
Users could upload images from their local photo library.  
Automatic Splitting
Logic was implemented to calculate split line positions based on the chosen page size.  
Manual Adjustments
Basic gesture support allowed users to add, move, or delete split lines using click or press-and-drag gestures.  
Image Processing
The app manipulates the original image by cropping it into multiple segments based on the split line positions.
4.3 Iterative Refinements
After testing the initial prototype, I identified several areas for improvement and iterated on the design and functionality.
Improved UI/UX
Refined UI components based on the revised wireframe. Redesigned the split interface to display delete and drag buttons, as well as the page number on each individual split line.  
Enhanced Gestures
Expanded gesture support to include pinch-to-zoom and swipe-to-scroll, making manual adjustments smoother and more intuitive. I also added a zoom-in/zoom-out button as an alternative method to zoom in/out.  
Result Preview
Implemented a preview interface that displays cropped images in a carousel, allowing users to preview the final result.  
Image Export
Added functionality to export final images to the photo library or share them as a PDF.
4.4 Final Prototype
The final prototype incorporated all refinements and provided a complete version of the app. It added the following features to improve the user experience:
Translation
Added translation support for both English and Chinese-speaking users.  
Local Storage
Implemented local storage to save user preferences, including language choice, page size, and auto-split settings.  
Animation
Added an entrance animation to the app name and description, enhancing visual appeal. Also included an animated loading indicator during image processing to inform users that the app is working.  
Haptic Feedback
Implemented subtle haptic feedback when interacting with split lines to provide immediate visual feedback.  
Alerts
Alerts were added to notify users when an error occurs or when images are saved to the library.
This version was thoroughly tested by users and served as a solid foundation for further development.

## 5. Development

2. Unit Testing
3. Evaluation



