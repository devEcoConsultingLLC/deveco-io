export default defineNuxtPlugin(() => {
  // Better Auth client is initialized in @deveco/auth/client
  // and accessed through the useAuth composable.
  // This plugin ensures the auth module is loaded early.
});
