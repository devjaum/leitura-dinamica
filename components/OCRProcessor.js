import React, {useEffect} from "react";
import RNFS from "react-native-fs";
import { PDFDocument, PDFPage } from "react-native-pdf-lib";
import TesseractOcr, { LANG_PORTUGUESE} from "react-native-tesseract-ocr";

const OCRProcessor = ({ pdfPath, onWordsExtracted}) => 
    {
        useEffect(() =>
        {
            const extractWordsFromPdf = async () =>
                {
                    try
                    {
                        const imagePaths = await convertPdfToImages(pdfPath);

                        let allWords = [];

                        for (let imagePath of imagePaths) {
                            const text = await TesseractOcr.recognize(imagePath, LANG_PORTUGUESE, {
                                whitelist: null,
                                blacklist: null
                            });

                            const wordArray = text.split(/\s+/).filter(word => word.length > 0);
                            allWords = [...allWords, ...wordArray];
                        }

                        onWordsExtracted(allWords);
                    }
                    catch (error)
                    {
                        console.log(error);
                    }
                };

                extractWordsFromPdf();
        }, [pdfPath]);

        return null;
    };

const convertPdfToImages = async (pdfPath) => 
{
    const pdfDoc = await PDFDocument.open(pdfPath);
    const pageCount = await pdfDoc.getPageCount();

    let imagePaths = [];
    for (let i = 0; i < pageCount; i++)
    {
        const page = await pdfDoc.getPage(i + 1);
        const { width, height} = page.getSize();
        const imagePath = `${RNFS.DocumentDirectoryPath}/pages_${i + 1}.png`;

        await page.render({
            path: imagePath,
            width,
            height,
            dpi: 300,
            quality: 1.0
        });

        imagePaths.push(imagePath);
    }

    return imagePaths;
};

export default OCRProcessor;
    