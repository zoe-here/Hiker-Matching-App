import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().nonempty("First name must not be blank"),
  lastName: z.string().nonempty("Last name must not be blank"),
  email: z.string()
    .nonempty("Email must not be blank")
    .email("Please provide a valid email address"),
  password: z.string().nonempty("Password must not be blank"),
  birthDate: z.string().nonempty("Birth date must not be blank").refine(
    val => {
      const input = new Date(val);
      const today = new Date();
      input.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      return input < today;
    },
    { message: "Birth date must be in the past" }
  ),
  gender: z.string().nonempty("Gender must not be null"),
  ownExperienceLevel: z.string().nonempty("Experience level must not be null"),
  ownPace: z.string().nonempty("Pace must not be null"),
  ownRegion: z.string().nonempty("Region must not be null"),
  ownLanguages: z.array(z.string()).min(1, "At least one language must be selected"),
  ownHikeTypes: z.array(z.string()).min(1, "At least one hike type must be selected"),
});