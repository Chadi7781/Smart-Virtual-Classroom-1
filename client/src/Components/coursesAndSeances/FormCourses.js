import React from "react";

import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import {
  Button,
  Dropdown,
  Form,
  Header,
  Loader,
  Message,
  Select,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddCourses,
  RetrieveCoursesByIdClass,
} from "../../redux/slices/Courses";
import { useParams } from "react-router";
import { isAuth, signout } from "../../helpers/auth";

function FormCourses(props) {
  const seances = useSelector((state) => state.seance.seance);
  const { id } = useParams();
  const [titre, SetTitre] = useState("");
  const [description, SetDescription] = useState("");
  const [idSance, SetIdSeance] = useState(2);
  const [dateCreation, SetDateCreation] = useState(Date.now());
  const [multiple_resources, SetMultiple_resources] = useState([]);
  const [formClassName, SetFormClassName] = useState("");
  const [formSuccessMessage, SetFormSuccessMessage] = useState("");
  const [formErrorMessage, SetFormErrorMessage] = useState("");
  const [selectedItem, SetSelectedItem] = useState(0);
  const [loader, SetLoader] = useState(false);
  const CurrentClass = JSON.parse(localStorage.getItem("idClass"));
  const idClass = CurrentClass._id;

  const SeanceOptions = [{ key: Number, text: "", value: "" }];
  const dispatch = useDispatch();
  for (let i = 0; i < seances.length; i++) {
    const option = {
      key: seances[i]._id,
      text: seances[i].titre,
      value: seances[i].titre,
    };

    SeanceOptions.push(option);
  }

  const handleChangeSelect = async (e) => {
    console.log(e.target.value);
    await SetSelectedItem(e.target.value);
    await console.log(selectedItem);
  };
  const handleTitreChanges = (e) => {
    console.log(id);
    SetTitre(e.target.value);
  };
  const handleDescriptionChanges = (e) => {
    SetDescription(e.target.value);
  };
  const AddCourse = (e) => {
    e.preventDefault();
    const idOwner = isAuth()._id;

    const rep = dispatch(
      AddCourses(
        selectedItem,
        titre,
        description,
        multiple_resources,
        idOwner,
        idClass
      )
    )
      .then((response) => {
        console.log(response);

        const CurrentClass = JSON.parse(localStorage.getItem("idClass"));
        console.log(CurrentClass._id);
        dispatch(RetrieveCoursesByIdClass(CurrentClass._id));
        console.log(response);
        SetFormClassName("success");
        SetFormSuccessMessage(response.msg);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            SetFormClassName("warning");
            SetFormErrorMessage(err.response.msg);
          }
        } else {
          SetFormClassName("warning");
          SetFormErrorMessage("Something wen wrong " + err);
        }
      });
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);

    if (status === "done") {
      SetMultiple_resources(multiple_resources.concat(file));
    }
    if (status === "removed") {
      let multiple_resource = multiple_resources.slice();
      multiple_resource = multiple_resources.filter((u) => {
        return u !== file;
      });
      SetMultiple_resources(multiple_resource);
    }
  };

  return (
    <div>
      <Form className={formClassName} onSubmit={AddCourse}>
        <Form.Input
          label="Titre"
          type="text"
          placeholder={"Seance 1"}
          name="Titre"
          maxLength="40"
          required
          value={titre}
          onChange={handleTitreChanges}
        />
        <Form.TextArea
          label="Description"
          type="text"
          placeholder="In this workshop we will learn ..."
          name="Description"
          maxLength="5000"
          required
          value={description}
          onChange={handleDescriptionChanges}
        />
        <Header as="h5" icon="file alternate outline" content="Select Seance" />
        <select value={selectedItem} onChange={handleChangeSelect}>
          {SeanceOptions.map((c, index) => (
            <option key={index} value={c.key}>
              {c.text}
            </option>
          ))}
        </select>

        <Header as="h5" icon="images outline" content="Select Files" />

        <Dropzone
          styles={{ dropzone: { minHeight: 120, maxHeight: 250 } }}
          onChangeStatus={handleChangeStatus}
        />
        {loader ? (
          <Loader active inline="centered" />
        ) : (
          <>
            <Message
              success
              color="green"
              header="Nice one! 📒 📕 📚 📖"
              content={formSuccessMessage}
            />
            <Message
              warning
              color="yellow"
              header="Woah! 😱 😨"
              content={formErrorMessage}
            />
          </>
        )}

        <br />
        <Button color="black" floated="right">
          Add
        </Button>
        <br />
        <br />
      </Form>
    </div>
  );
}

export default FormCourses;
