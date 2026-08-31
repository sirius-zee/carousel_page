import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { fadeInUp } from "../../lib/animation";

type SectionMotionProps = {
    children: React.ReactNode;
    className?: string;
    id?: string;
};

export default function SectionMotion({
    children,
    className,
    id,
    ...props
}: SectionMotionProps) {
    return (
        <motion.section
            id={id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className={cn("max-w-5xl 2xl:max-w-6xl mx-auto select-none", className)}
            {...props}
        >
            {children}
        </motion.section>
    );
}
