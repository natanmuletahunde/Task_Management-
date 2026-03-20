Create a modern, production-level To-Do mobile application using Expo (React Native) with the following requirements:

Tech Stack:
- Expo (latest SDK)
- React Native
- Tailwind CSS (NativeWind already configured)
- Expo Router
- TypeScript

UI/UX Requirements:
- Clean, modern, premium UI design
- Use glassmorphism (Expo GlassEffect) for cards and headers
- Smooth animations (use reanimated if needed)
- Dark mode support
- Responsive layout for all screen sizes
- Use rounded corners, shadows, spacing, and gradients

Core Features:
1. Task Management
   - Add, edit, delete tasks
   - Mark tasks as complete using expo-checkbox
   - Task categories (Work, Personal, Fitness, etc.)
   - Due dates and priority levels

2. Smart Features
   - Daily progress tracking
   - Completion percentage indicator
   - Filter tasks (All / Completed / Pending)

3. Pedometer Integration
   - Use Expo Pedometer
   - Show daily step count
   - Allow users to create fitness-related tasks (e.g., walk 5000 steps)
   - Display progress bar for steps

4. Image Support
   - Use expo-image
   - Add images/icons to tasks
   - Show placeholder blur while loading
   - Smooth transitions between images

5. Beautiful UI Components
   - Glass cards using Expo GlassEffect
   - Floating action button (Add Task)
   - Animated task list
   - Custom checkbox styling
   - Header with greeting (e.g., "Good Morning")

6. Storage
   - Use AsyncStorage or SecureStore
   - Persist tasks locally

7. Navigation
   - Use Expo Router
   - Tabs:
     - Home (Tasks)
     - Stats (progress + pedometer)
     - Profile

8. Extra Enhancements
   - Swipe to delete tasks
   - Task animations when completed
   - Empty state illustrations
   - Loading skeleton UI

Code Requirements:
- Clean folder structure
- Reusable components
- Proper TypeScript types
- Separation of concerns (hooks, components, screens)
- Comments for important parts

Output:
- Full project structure
- All screens and components
- Styling using Tailwind classes
- No explanation, only clean and complete code
