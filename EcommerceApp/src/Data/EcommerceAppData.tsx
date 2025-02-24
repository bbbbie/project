import { OnboardingPrograms } from "../TypesCheck/OnboardingTypesCheck";

export const OnboardingData: OnboardingPrograms[] = [
  {
    _id: "onboarding1",
    text: "Image 1",
    textColor: "#000080",
    backgroundColor: "rgba(25,232,127,1)",
    imageUrl: require("../../assets/onboarding/cat404.json"),
  },
  {
    _id: "onboarding2",
    text: "Image 2",
    textColor: "#000080",
    backgroundColor: "rgb(247, 9, 216)",
    imageUrl: require("../../assets/onboarding/panda.json"),
  },
];
