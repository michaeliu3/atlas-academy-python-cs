import type { Metadata } from "next";
import { CoursePortal } from "./CoursePortal";

export const metadata: Metadata = {
  title: "Atlas Academy · Python & Computer Science",
  description:
    "A connected, AI-native undergraduate computer science course taught through Python.",
};

export default function Home() {
  return <CoursePortal />;
}
