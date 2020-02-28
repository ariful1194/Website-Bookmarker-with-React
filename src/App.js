import React, { useState } from "react";
import "./assets/css/customfont.css";
import "./assets/sass/main.scss";
import "bootstrap/dist/css/bootstrap.css";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [url, setUrl] = useState();
  const [today, setToday] = useState(new Date());
  const [websites, setwebsites] = useState(getWebsites());
  const [edit, setEdit] = useState(false);

  function getWebsites() {
    let list = localStorage.getItem("bookmark");
    return JSON.parse(list);
  }

  let submitHnadler = e => {
    e.preventDefault();
    if (name && url) {
      if (!edit) {
        let newaWebsite = {
          id: uuidv4(),
          name,
          url,
          date: today.toLocaleString()
        };

        let bookmark = localStorage.getItem("bookmark");
        if (bookmark) {
          // if already have website list
          let list = JSON.parse(bookmark);
          let newList = [...list, newaWebsite];
          localStorage.setItem("bookmark", JSON.stringify(newList));
          setwebsites(newList);
        } else {
          //if empty
          setwebsites([newaWebsite]);
          localStorage.setItem("bookmark", JSON.stringify([newaWebsite]));
        }
      } else {
        let newList = websites.map(website => {
          if (website.id == id) {
            website.name = name;
            website.url = url;
          }
          return website;
        });
        setwebsites(newList);
        localStorage.setItem("bookmark", JSON.stringify(websites));
        setName("");
        setUrl("");
      }
      e.target.reset();
    }
  };
  let deleteHandler = id => {
    let confirm = window.confirm("Are you sure !");
    if (confirm) {
      let newList = websites.filter(website => website.id != id);
      setwebsites(newList);
      localStorage.setItem("bookmark", JSON.stringify(newList));
    }
  };
  let editableHandler = (id, name, url) => {
    setId(id);
    setUrl(url);
    setName(name);
    setEdit(true);
  };

  let tableInfo = websites
    ? websites.map((website, index) => (
        <tr>
          <th scope="row">{index + 1}</th>
          <td>{website.name}</td>
          <td>{website.url}</td>
          <td>{website.date}</td>
          <td>
            <button className="btn btn-success mr-1">
              <a
                className="text-white"
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit
              </a>
            </button>
            <button
              onClick={() => {
                editableHandler(website.id, website.name, website.url);
              }}
              className="btn btn-info mr-1"
            >
              Edit
            </button>
            <button
              onClick={() => {
                deleteHandler(website.id);
              }}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    : null;
  return (
    <div>
      <div className="container">
        <h2 className="title">WEBSITE BOOKMARKER</h2>
        <form onSubmit={submitHnadler} className="mt-2 mb-2">
          <div className="form-row">
            <div className="col">
              <input
                onChange={e => {
                  setName(e.target.value);
                }}
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={name}
              />
            </div>
            <div className="col">
              <input
                onChange={e => setUrl(e.target.value)}
                type="text"
                name="url"
                className="form-control"
                placeholder="Url"
                value={url}
              />
            </div>
            <div className="col">
              <input
                className="form-control btn btn-block btn-success"
                type="submit"
                value={edit ? "Save" : "Add"}
              />
            </div>
          </div>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">NAME</th>
              <th scope="col">URl</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{tableInfo}</tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
