---
name: User story
about: Create a user story to contain multiple child issues
title: "[USER STORY]"
labels: "user-story"
assignees: ""
---

body:
- type: textarea
  id: description
  attributes:
    label: Description
    description: "Describe the user story."
    value: |
      A clear and concise description of what the problem is.
      validations:
    required: true
- type: textarea
    id: implementation
    attributes:
    label: Implementation
    description: "Describe the implementation of the user story."
    value: |
      A clear and concise description of how the user story should be implemented.
      validations:
    required: true

**Acceptance Criteria**

<!-- Write a list of criteria to be met before the user story is considered complete -->

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

**Testing Criteria**

<!-- Write a list of test cases that must be implemented to ensure the user story works as expected -->

- [ ] Test Case 1
- [ ] Test Case 2
- [ ] Test Case 3
