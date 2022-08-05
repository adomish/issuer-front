import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const postPdfData = async (url: string, data: string) => {
    await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "text/plain",
        },
        body: data,
    })
        .then((response) => response.blob())
        .then((blob) => {
            const url = URL.createObjectURL(blob);
            const tag = document.createElement("a");
            document.body.appendChild(tag);
            tag.download = data;
            tag.href = url;
            tag.click();
            tag.remove();
        });
};

export default function FileList() {
    const [pdfList, setPdfList] = useState<string[]>([]);

    useEffect(() => {
        fetch(
            "https://w97dpysowh.execute-api.us-east-1.amazonaws.com/download-list",
            {
                method: "GET",
                mode: "cors",
            }
        )
            .then((response) => response.json())
            .then((data: string[]) => {
                setPdfList(data);
            });
    }, []);

    const postFileName = (fileName: string): void => {
        postPdfData(
            "https://w97dpysowh.execute-api.us-east-1.amazonaws.com/send-pdf",
            fileName
        );
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.grid}>
                    {pdfList.map((fileName) => (
                        <button
                            key={fileName.toString()}
                            onClick={() => postFileName(fileName)}
                            className={styles.card}
                        >
                            <h2>{fileName}</h2>
                            <p>ダウンロード　&darr;</p>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
