import type { Metadata } from "next";
import { CourseReaderHeader } from "../../modules/CourseReaderHeader";
import { ScopeInventory } from "../ScopeInventory";
import styles from "../route.module.css";

export const metadata: Metadata = {
  title: "Levels 1–9 Source Crosswalk · Atlas Academy",
  description:
    "The source-target evidence crosswalk behind Atlas Academy's Levels 1–9 Scope Matrix.",
};

export default function ScopeInventoryPage() {
  return (
    <main className={styles.shell}>
      <CourseReaderHeader current="route" />
      <div id="main-content" tabIndex={-1}>
        <ScopeInventory />
      </div>
    </main>
  );
}
