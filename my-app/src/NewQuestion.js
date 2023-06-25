import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const NewQuestion = () => {

  const allTags = require('../src/tags.json').tags;

  const [fileContents, setFileContents] = useState(null);
  const [selectingImage, setSelectingImage] = useState(true);
  const [crop, setCrop] = useState({});
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [itemSelected, setItemSelected] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const addTag = () => {
    if (allTags.includes(text) && !selectedTags.includes(text)) {
      setSelectedTags(selectedTags.concat([text]));
    } else {
      alert("Invalid Selection");
    }
  }

  const removeTag = () => {
    if (allTags.includes(text) && selectedTags.includes(text)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== text));
    } else {
      alert("Invalid Selection");
    }
  }

  const postQuestion = () => {
    const output = cropImageNow();

    if (output == "data:,") {
      alert('Please select your question from the image');
      return;
    }
    if (selectedTags.length == 0) {
      alert('Please select at least one tag');
      return;
    }

    axios.post('http://localhost:5000/send', {
      image_url: output,
      topics: selectedTags
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    },
    )
      .catch(function (error) {
        console.log(error);
      });

    setCrop({});
    setText('');
    setTags([]);
    setItemSelected(false);
    setSelectedTags([]);
  }

  const textEditted = (newText) => {
    setText(newText);
    setTags(allTags.filter(tag => tag.includes(newText)));
    setItemSelected(false);
  }

  const itemClicked = (item) => {
    setText(item);
    setItemSelected(true);
  }

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      if (["image/gif", "image/jpeg", "image/png"].includes(file['type'])) {
        setFileContents(URL.createObjectURL(file));
        setSelectingImage(false);
      } else {
        alert("Invalid File Type!");
        setSelectingImage(true);
      }
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const cropImageNow = () => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    // Converting to base64
    const base64Image = canvas.toDataURL('image/jpeg');
    return base64Image;
  }

  return (
    <div className="newquestion">
      {selectingImage && <div className="choosefiledialog">
        <div className="newquestionrow">
          <h1>Choose an Image</h1>
        </div>
        <hr />
        <div className="newquestionrow">
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <h1>Drop the files here ...</h1> :
                <h2>Drag and drop some files here, or click to select files</h2>
            }
          </div>
        </div>
      </div>}
      {!selectingImage &&
        <div className="addquestion">
          <div className="imagecropper">
            {fileContents &&
              <ReactCrop src={fileContents} onImageLoaded={setImage}
                crop={crop} onChange={setCrop} />}
          </div>
          <div className="line" />
          <div className="addquestionoptionlist">
            <div className="tagadder">
              <div className="line" />
              <div className="choosetagforaddquestion">
                <input className="upload" type="text" placeholder="Tag Search" value={text} onChange={e => textEditted(e.target.value)} />
                {!itemSelected && text.length != 0 && (<div className="addquestiontagslist">
                  <Dropdown.Menu className="addquestiontagdropdown" show>
                    {tags.length == 0 && (
                      <Dropdown.Item eventKey="No Results Found">No Results Found</Dropdown.Item>
                    )}
                    {tags.map((tag) => (
                      <Dropdown.Item eventKey={tag} key={tag} onClick={() => itemClicked(tag)}>{tag}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </div>)}
              </div>
              <Button className="upload" variant="primary" onClick={addTag}>Add Tag</Button>
              <Button className="upload" variant="danger" onClick={removeTag}>Remove Tag</Button>
            </div>
            <div className="line" />
            <div className="addquestiontaglist">
              <textarea placeholder="Tags" value={('' + selectedTags)} readOnly={true} />
            </div>
            <Button className="upload" variant="success" onClick={postQuestion}>Upload Question</Button>
          </div>
        </div>
      }
    </div>
  );
}

export default NewQuestion;