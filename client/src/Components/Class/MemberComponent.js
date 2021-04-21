import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Header,
  Icon,
  Image,
  Segment,
} from "semantic-ui-react";
import { AddclassApi, getclassApi } from "../../api/api";
import {
  fetchclass,
} from "../../redux/slices/classsline";
import AddUserToClassComponent from "./AddUserToClassComponent";

function MemberComponent() {
  const history = useHistory();
  const classinvit = JSON.parse(localStorage.getItem("idClass"));
  const documentData = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const Remove = async (idclass, email) => {
    try {
      const res = await AddclassApi.removeUserFromClass(idclass, email);
      console.log(res);
      const res2 = await getclassApi.getclassById(classinvit._id);
      localStorage.setItem("idClass", JSON.stringify(res2));
      dispatch(fetchclass(documentData.role, documentData._id));
      history.push("/members");
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      {classinvit.classOwner._id === documentData._id && (
        <AddUserToClassComponent floated="right" />
      )}
      <Header as="h2" icon textAlign="center">
        <Icon name="users" size="big" />
        Accounts
      </Header>
      <Segment raised color="red">
        <div>
          <Header.Subheader>
            {classinvit.classUsers?.map((co, i) => (
              <div key={i}>
                <Grid stackable>
                  <Grid.Row>
                    <Grid.Column width={1}>
                      <Image
                        circular
                        size="mini"
                        src={co.picture}
                      />
                    </Grid.Column>
                    <Grid.Column width={14}>{co.name}</Grid.Column>
                    <Grid.Column width={1}>
                      {classinvit.classOwner._id === documentData._id ? (
                        <Icon
                          name="delete"
                          size="tiny"
                          link
                          onClick={() => Remove(classinvit._id, co.email)}
                        />
                      ) : (
                        <></>
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            ))}
          </Header.Subheader>
        </div>
      </Segment>
    </div>
  );
}

export default MemberComponent;
