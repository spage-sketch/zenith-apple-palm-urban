import { createFileRoute } from "@tanstack/react-router";
import { MacroApp } from "@/components/macro/app";

export const Route = createFileRoute("/")({
  component: MacroApp,
});
