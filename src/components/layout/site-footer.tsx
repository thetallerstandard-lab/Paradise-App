import { Container } from "@/components/layout/container";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <Container className="flex flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{BRAND.tagline}</p>
        <p>&copy; {new Date().getFullYear()} {BRAND.name}</p>
      </Container>
    </footer>
  );
}
