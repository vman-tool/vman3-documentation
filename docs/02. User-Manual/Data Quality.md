---
sidebar_position: 4
---

# Data Quality
## Intro

The Error tab is designed to help users identify, analyze, and correct errors in data processing. It provides different sections to categorize errors, filter them, and take necessary actions for data cleaning.Select Error Source
Users can choose the source of the error from two available algorithms namely InterVA 5 or Insilico VA. 

![Dashboard image 1](./img/dashboard/Dataquality.bmp)

## Error List
### Group Error List

The **Group Error** List serves as an organized classification of errors based on their nature, allowing users to easily recognize patterns and common issues within the dataset. This categorization simplifies the process of error management by grouping similar types of errors together, making it easier to pinpoint systemic issues that may require adjustments in data collection, processing, or validation.

Errors may be classified under categories such as:

 - Data Discrepancy – These errors arise from inconsistencies in recorded data values, which may indicate missing, mismatched, or conflicting information.
 - Error in Age Indicator66 – This category highlights issues related to incorrect or missing age values, which can impact analyses that rely on demographic information.
 - Error in Indicators – This includes general errors affecting various predefined indicators used in data analysis, potentially affecting outcomes and insights drawn from the data.

### Individula Error List

The **Individual Error** List provides a more granular view of each specific issue. This section allows users to filter errors based on their assigned category, ensuring they can focus on specific types of errors without being overwhelmed by unrelated issues.

Each error entry within the Individual Error List includes:

 - Data ID – A unique identifier for the specific record where the issue was detected, enabling easy tracking and reference.
 - Error Type – A description of the nature of the error, giving users an immediate understanding of the issue at hand.
 - Source – Indicates which algorithm (InterVA 5 or Insilico VA) detected the error, helping users determine the origin of the issue.
 - Error Message – A detailed explanation of what went wrong, providing insights into potential fixes.
 - View Action – An option to inspect the error in more depth, allowing users to analyze the affected data entry and take necessary corrective measures.

By structuring errors in this manner, the system enables a streamlined workflow for error detection, filtering, and resolution. This structured approach improves efficiency in data validation and correction, ensuring the accuracy and reliability of processed data

## Clean data
The Data Cleaner section is designed for comprehensive error analysis and correction, providing users with the tools they need to efficiently identify, review, and resolve data inconsistencies. This section ensures that errors are not only detected but also systematically corrected to maintain the accuracy and reliability of the dataset. to access it simple click the blue **Clean Data** Button at the left of each entry. This will lead to the data cleaner section. 

![Dashboard image 1](./img/dashboard/datacleaner.bmp)

Simpoly edit the fields with errors and once done click the blue **Save changes** button 