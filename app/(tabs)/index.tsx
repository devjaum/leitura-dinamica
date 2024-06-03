import { Text, StyleSheet, TextInput, FlatList, TextBase } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FilePicker from "../../components/FilePicker";
import OCRProcessor from "../../components/OCRProcessor";
import DocumentPicker from "react-native-document-picker";

const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const DATA = [
  {
    label: "Palavra por segundo",
    value: 1,
  },
  {
    label: "Palavra por minuto",
    value: 60,
  },
  {
    label: "Palavra por hora",
    value: 3600,
  },
];

export default function HomeScreen() {

  const [texto, setTexto] = useState("");
  const [palavra, setPalavra] = useState("");
  const [timeUnit, setTimeUnit] = useState(DATA[0]);
  const [showpalavra, setShowPalavra] = useState("none");
  const [media, setMedia] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeouts = useRef<any[]> ([]);

  useEffect(() => {
    if (!isPaused && currentIndex > 0)
      {
        leituraDinamica(currentIndex);
      }

      return () => clearAllTimeouts();
  }, [isPaused]);

  const newText = function (text:string)
  {
    setTexto(text);
  }

  const mudarMedia = function (event:number)
  {
    setMedia(String(event));
  }

  const clearAllTimeouts = () => {
    timeouts.current.forEach(timeout => clearTimeout(timeout));
    timeouts.current = [];
  }

  const leituraDinamica = function (startIndex = 0)
  {

    const seletorPalavra = texto.split(" ");
    clearAllTimeouts();
    for (let i = 0; i < seletorPalavra.length; i++) 
      {
        const timeout = setTimeout(() =>
        {
          if (!isPaused)
          {
            setPalavra(seletorPalavra[i]);
            setCurrentIndex(i + 1);
          }
        }, (timeUnit.value / Number(media)) * 1000 * (i - startIndex));
        timeouts.current.push(timeout);
      }
  }

  const ExibirPalavras = function ()
  {

    return(
      <p style={{display: showpalavra, fontSize: '5vh', color: 'white'}}>
        {palavra}
      </p>
    )
  }

  const handlePause = () => {
    setIsPaused(true);
    setShowPalavra("none");
  }

  const handleResume = () => {
    setIsPaused(false);
  }

  const handleStop = () => {
    setIsPaused(false);
    setShowPalavra("none");
    setPalavra("");
    setCurrentIndex(0);
    clearAllTimeouts();
  }

  const Item = ({item}: any) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === timeUnit.value && styles.selectedOption
      ]}
      onPress={() => 
      {
        setTimeUnit(item);
        setIsExpanded(false);
      }}
        >
        <Text style={{color: "#EEEEEE"}}>{item.label}</Text>
      </TouchableOpacity>
  );

  return (
    <main style={styles.main}>
      <TextInput
        inputMode='text'
        value={texto}
        onChangeText={text => newText(text)}
        style={[styles.input,{display: (showpalavra == "none" ? "flex": "none"), width:'auto' }]} 
        />
      <div style={styles.div}>
        <TextInput 
          inputMode='numeric' 
          value={media} 
          onChangeText={text => mudarMedia(Number(text))} 
          style={[{display: (showpalavra == "none" ? "flex": "none") }, styles.input]}
          />
        <TouchableOpacity
          style={[{display: (showpalavra == "none" ? "flex": "none")}]}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.optionText}>{timeUnit.label}</Text>
        </TouchableOpacity>
        </div>
          {isExpanded && 
          (
            <div style={{height: "auto"}}>
              <FlatList
                data={DATA}
                renderItem={({item}) => <Item item={item}/>}
                keyExtractor={item => item.label}
                style={styles.optionContainer}
              />
            </div>
          )}
      <ExibirPalavras/>
      <div style={styles.div}>
        <TouchableOpacity
          style={[styles.button,{display: (showpalavra == "none" ? "flex" : "none")}]} 
          onPress={ () => 
            {
              setShowPalavra("flex");
              leituraDinamica();
            }
          }
          >
            <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {display: (showpalavra == "none" ? "none": "flex") }]}
          onPress={(isPaused) ? handleResume : handlePause}
        >
          <Text style={styles.buttonText}>{(isPaused) ? "Retomar" : "Pausar"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {display: (showpalavra == "none" ? "none": "flex") }]} 
          onPress={handleStop}
        >
          <Text style={styles.buttonText}>Parar</Text>
        </TouchableOpacity>
      </div>
    </main>
  );
}

const styles = StyleSheet.create({
  main: {
    display: "flex",
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#222831',
    },
  button: {
    backgroundColor: '#0078FF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#EEEEEE',
    fontSize: 16
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    width: "25%",
  },
  div: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'center'
  },
  optionText: {
    color: '#EEEEEE'
  },
  selectedOption: {
    backgroundColor: "#76ABAE"
  },
  option: {
    padding: 10,
    backgroundColor: "#31363F",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  optionContainer: {
    display: 'flex',
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#31363F'
  }
});
