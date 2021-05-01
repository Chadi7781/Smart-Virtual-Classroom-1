import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago/commonjs/ReactTimeAgo";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Message,
  Modal,
} from "semantic-ui-react";
import { getDetailByTaskByStudent, rendreTask } from "../../redux/slices/Grade";
import ModalTask from "./ModalTask";

export default function TaskQuizDetail() {
  const { id } = useParams();
  const state = useSelector((state) => state.grades.grades);
  //const files = useSelector((state) => state.tasks.files);
  const [task ,setTask] = useState(state[0]);

  const grade = {
    id: id,
    taskStatus: "remis",
  //  listReponse: files,
  };


  const dispatch = useDispatch();
  const submitTask = () => {
    console.log("grade : ");
    console.log(grade);
  
    dispatch(rendreTask(grade)).then(() => {
      dispatch(getDetailByTaskByStudent(id)).then((response)=>{
     
  setTask(response.payload[0]);
      });
    });
  };
 // console.log(task);
  useEffect(() => {
    
    dispatch(getDetailByTaskByStudent(id)).then((response)=>{
     
      setTask(response.payload[0]);
          });
          console.log(task);
    
  }, []);

  return (
    <div>
      {!task ? (
        <></>
      ) : (
        <Grid>
          <Grid.Row>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column width={14}>
              <Grid>
                {" "}
                <Grid.Row>
                  {" "}
                  <Grid.Column width={12}>
                    <Header as="h1">
                      <Icon name="file alternate" />
                      <Header.Content>
                        {task.task.title}
                        <Header.Subheader>
                          <ReactTimeAgo
                            date={task.task.DateAt}
                            locale="en-US"
                          />
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                    <Divider></Divider>
                    <br />
                    <Container>
                      <p>{task.task.description}</p>
                    </Container>
                  
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card>
                      <Card.Content>
                        <Card.Header>Your Task</Card.Header>

                        <Card.Description>
                          {task.taskStatus === "Remis" ? (
                            <>
                              <Message positive>
                                <Message.Header>
                                  Task Added Succesfully
                                </Message.Header>
                              </Message>
                            </>
                          ) : (
                            <>
                              {" "}
                              <Message
                                header="Upload Your File Here "
                                content="Good Luck For your assignment"
                              />
                            </>
                          )}
                        </Card.Description>
                        <br />
                   
                      </Card.Content>
                      <Card.Content extra>
                          
                          <Modal
        trigger={<Button color="red" content="Start Quiz" />}
        dimmer="inverted"
        size="tiny"
        closeIcon="close"
      >
          <Modal.Header>Quiz </Modal.Header>
        <Modal.Content>
            <p>Start</p>
        </Modal.Content>

    
      <Modal.Actions>
          <Link to={"/TaskQuiz/"+task._id}>
          <Button color="red">Start</Button>
          </Link>
          <Button color="black">Back</Button>
      </Modal.Actions>
      </Modal>             
                    
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>

            <Grid.Column width={1}></Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </div>
  );
}