import React from "react";
import { Button, TouchableOpacity } from "react-native";
import DocumentPicker from "react-native-document-picker";

const FilePicker = ({ onFilePicked}: any) => {
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf]
            });
            if (result.length > 0) {
                onFilePicked(result[0].uri);
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log("User cancelled the picker");
            } else {
                console.log(error);
            }
        }
    };

    return (
    <Button onPress={() => pickFile} title="PDF"/>)
}

export default FilePicker;