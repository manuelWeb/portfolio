import type { ElementType, ReactNode } from "react";
import { Container } from "@/components/layout/Container/Container";
import styles from "./Section.module.scss";

type SectionProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Section({
  as: Element = "section",
  children,
  className,
  containerClassName,
}: SectionProps) {
  const classNames = [styles.section, className].filter(Boolean).join(" ");

  return (
    <Element className={classNames}>
      <Container className={containerClassName}>{children}</Container>
    </Element>
  );
}
