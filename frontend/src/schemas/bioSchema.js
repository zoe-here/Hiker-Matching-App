import { z } from "zod";

export const bioSchema = z.object({
  ownExperienceLevel: z.string().nonempty("Experience level must not be blank"),
  ownPace: z.string().nonempty("Pace must not be blank"),
  ownRegion: z.string().nonempty("Region must not be blank"),
  ownLanguages: z.array(z.string()).min(1, "At least one language must be selected"),
  ownHikeTypes: z.array(z.string()).min(1, "At least one hike type must be selected"),
});
