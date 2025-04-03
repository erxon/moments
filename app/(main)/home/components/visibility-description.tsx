export default function visibilityDescription(value: string) {
  if (value === "public") {
    return "Everyone will see this content";
  } else if (value === "private") {
    return "This will be a private content. Only you can see this.";
  } else if (value === "followers") {
    return "Only your followers can see this content.";
  }
}
