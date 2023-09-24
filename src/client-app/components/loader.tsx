import styles from "./loader.module.scss"
import Center from "@/components/center";

export default function Loader({title}: { title: string }) {
    return (
        <Center>
            <h2>{title}</h2>
            <div className={styles.Loader}>
                <div className={styles.LoaderBullet}></div>
                <div className={styles.LoaderBullet}></div>
                <div className={styles.LoaderBullet}></div>
            </div>
        </Center>
    )
}