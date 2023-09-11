import styles from "./loader.module.scss"
import Center from "@/app/_components/center";

export default function Loader({title}: { title: string }) {
    return (
        <Center>
            <h3 className={styles.Title}>{title}</h3>
            <div className={styles.Loader}>
                <div className={styles.LoaderBullet}></div>
                <div className={styles.LoaderBullet}></div>
                <div className={styles.LoaderBullet}></div>
            </div>
        </Center>
    )
}