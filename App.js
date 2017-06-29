
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container, Header, Title, Content, Text,
    Button, Icon, Left, Right, Body, Badge,
    List, ListItem
} from 'native-base';
import { View, ListView } from 'react-native';

import styles from './styles/styles';

var taskArray = [];

class App extends React.Component {
    constructor(props) {
        super(props);

        var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.Id != r2.Id });
        this.state = {
            tasks: taskArray,
            dataSource: dataSource.cloneWithRows(taskArray),
            isLoading: true
        }
    }

    componentDidMount() {
        this.getTaskList();
    }

    findTaskIndex(taskId) {
        let { tasks } = this.state;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].Id === taskId) {
                return i;
            }
        }

        return -1;
    }

    async getTaskList() {
        try {
          this.getTheData(function (json) {
              taskArray = json.Tasks;
              this.setState({
                  tasks: taskArray,
                  dataSource: this.state.dataSource.cloneWithRows(taskArray),
                  isLoading: false
              })
          }.bind(this));
            
        } catch (error) {
            console.log("There was an error getting the tasks");
        }
    }

    getTheData(callback) {
        var url = "http://localhost:8086/ws2/projects/taskssample";
        fetch(url).then(response => response.json())
            .then(json => callback(json))
            .catch(error => console.log(error));
    }

    renderRow(rowData, sectionId, rowId) {
        let { checkBoxAnimation } = this.state;
        let { checkBoxAnimation2 } = this.state;
        return (
            <ListItem>
                <Body>
                    <Text>{rowData.Description}</Text>
                    <View>
                        <Text style={styles.taskDate}>{rowData.CreatedOn}</Text>
                    </View>
                </Body>

                <Right>
                    <Text style={styles.taskEffort}>{rowData.Effort}</Text>
                </Right>
            </ListItem>
        );
    }

    render() {
        let currentView = <View />;
        if (this.state.isLoading) {
            currentView = <View />;
        } else {
            currentView = <ListView style={styles.taskListView}
                dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}
                enableEmptySections={true}
            />;
        }

        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        </Left>
                    <Body>
                        <Title>My tasks</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content>
                    {currentView}
                </Content>
            </Container>
        );
    }
}


export default App;
