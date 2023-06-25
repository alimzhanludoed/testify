import { useState } from "react";
import { ReactDOM } from "react";
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import ParticleBackground from "./components/background.js"
import Button from "react-bootstrap/Button";

const Home = () => {

  var data = require('../src/tags.json');
  const allTags = data.tags;

  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const [itemSelected, setItemSelected] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [globalIndex, setGlobalIndex] = useState(-1);

  const textEditted = (newText) => {
    setText(newText);
    setTags(allTags.filter(tag => tag.includes(newText)));
    setItemSelected(false);
  }

  const itemClicked = (item) => {
    setText(item);
    setItemSelected(true);
    axios.post('http://localhost:5000/retrieve', {
      topic: item
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    },
    )
      .then(function (res) {
        setQuestions([...res.data]);
        // displayQuestions();
      })
      .catch(function (error) {
        console.log(error);
      });

    /*const myNode = document.getElementsByClassName("q");
    for (let i = 0; i < myNode.length; i++) {
      while (myNode[i].firstChild) {
        myNode[i].removeChild(myNode[i].lastChild);
      }
    }*/
  }

  /*function displayQuestions() {
     let after = document.getElementsByClassName("home");
     //alert(after.length);
     //alert(questions.length);
     var elements = []
     //after[0].appendChild(document.createElement('br'));
     for (let i = 0; i < questions.length; i++) {
       //let question = React.createElement("div", {}, "Hello");
       var z = document.createElement('p'); // is a node
       z.className = "q";
       z.innerHTML = '<img src=\"' + questions[i].image_url +'\"/>';
       after[0].appendChild(z);
     }
   }*/

  function displayComments(index) {
    setGlobalIndex(index);
  }

  return (
    <div className="home">
      <div className="search">
        <div className="searchbar">
          <input className="mysearchbartext" type='text' value={text} onChange={e => textEditted(e.target.value)} placeholder="Tag Search" />
        </div>
        {!itemSelected && text.length != 0 && (<div className="tagsList">
          <Dropdown.Menu className="tagdropdown" show>
            {tags.length == 0 && (
              <Dropdown.Item eventKey="No Results Found">No Results Found</Dropdown.Item>
            )}
            {tags.map((tag) => (
              <Dropdown.Item eventKey={tag} key={tag} onClick={() => itemClicked(tag)}>{tag}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>)}
      </div>
        {questions && questions.map((question => {
          var topics = question.topic.substring(2, question.topic.length - 2).split("\", \"");

          var index = questions.indexOf(question);
          return (
            <div className="list" key={index}>
              <img onClick={() => displayComments(index)} className="image" src={question.image_url} />
              <div className="line"/>
              {globalIndex === index && (
                <div className="related-topics">
                  Related topics:
                  <div className="line"/>
                  {topics.map(t => (
                    <div key={t}>
                      <Button onClick={() => itemClicked(t)}className='related-topic' variant='success'>{t}</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          )
        }))}
        {}
    </div>
  );
}
export default Home;