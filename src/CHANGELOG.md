
# Changelog

All notable changes to the VentureWayfinder platform will be documented in this file.

## [Unreleased]

## [0.2.0] - 2024-07-25
### Added
- AIChatAssistant component for always-available business guidance
- Enhanced ChatConversation component with more comprehensive business data collection
- AI-driven task generation based on user's business information
- Improved business data model with additional fields (industry, problem, stage, solution)
- Floating chat widget for accessing AI assistance throughout the journey

### Changed
- Updated StepDetail interface to include progress, categories, and resources
- Enhanced personalization of generated tasks based on business data

## [0.1.0] - 2024-07-22
### Added
- Google Analytics integration with tracking ID G-0S6M6E18FX
- Initial journey creation and management functionality
- Business idea wizard for gathering user information
- Step-by-step journey progression system
- Task management system with categories and subtasks
- User authentication and subscription checks

### Fixed
- TaskDetailSheet.tsx: Corrected function argument counts in subtask and category handlers
- TaskDetailSheet.tsx: Resolved TypeScript errors related to event handling when adding new subtasks
- TaskDetailSheet.tsx: Improved date handling for the Calendar component
- StepDetailsDialog.tsx: Fixed "Cannot read properties of null (reading 'title')" error
- StepDetailsDialog.tsx: Implemented proper null checking for the stepDetails prop
- StepDetailsDialog.tsx: Enhanced dialog content to properly display when data is missing
