import { Banner } from "~/models/banner";

export interface BannerItemProps extends Banner {
    onUpdate(): void
    onDelete(): void
    isDragging?: boolean
}