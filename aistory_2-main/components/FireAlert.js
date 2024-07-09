import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { FontSize } from '../GlobalStyles';


class FireAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isHighHeatModalVisible: false,
    };

    // WebSocket 연결 설정
    this.ws = new WebSocket('ws://192.168.77.57:8082');
    // this.ws = new WebSocket('ws://192.168.35.45:8082');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.alertMessage === '화재 발생!') {
        this.showModal(); // 모달 열기
      }else if (data.alertMessage === '발열량 이상 발견') {
        this.showHighHeatModal(); // 발열량 이상 모달 열기
      }
    };
  }

  // 모달을 나타나게 하는 함수
  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  // 모달을 감추는 함수
  hideModal = () => {
    this.setState({ isModalVisible: false });
  };
  // 발열량 이상 모달
  showHighHeatModal = () => {
    this.setState({ isHighHeatModalVisible: true });
  };

  // 발열량 이상 모달을 감추는 함수
  hideHighHeatModal = () => {
    this.setState({ isHighHeatModalVisible: false });
  };


  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>화재 발생</Text>
              <Text style={styles.modalText2}>화재가 발생했습니다.</Text> 
              <Text style={styles.modalText3}>소방서에 신고가 완료 되었습니다.</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.hideModal} // 모달 닫기
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* 발열량 이상 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isHighHeatModalVisible}
          onRequestClose={() => {
            console.log('High Heat Modal has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView1}>
              <Text style={styles.modalText}>발열량 이상 발견</Text>
              <Text style={styles.modalText2}>발열량 이상이 감지되었습니다.</Text>
              <Text style={styles.modalText3}>전선을 확인해주세요.</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.hideHighHeatModal} // 모달 닫기
              >
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    width: 300,
    height: 300,
  },
  modalView1: {
    margin: 20,
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    width: 300,
    height: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize : 25
  },
  modalText2: {
    marginTop: 20,
    
    textAlign: 'center',
    fontWeight: "normal",
    color: 'white',
    fontSize : 20,
  },
  modalText3: {
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: "normal",
    color: 'white',
    fontSize : 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    height: 40,
    width : 130,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FireAlert;