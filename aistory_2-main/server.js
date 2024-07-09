const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const cron = require('node-cron');
const childProcess = require('child_process');

const axios = require('axios');


const app = express();
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 8082 });
// const wss = new WebSocket.Server('ws://localhost:8082');
// const pythonServerURL = 'http://192.168.86.57:5000';
const pythonServerURL = 'http://192.168.77.57:5000'
// const pythonServerURL = 'http://192.168.35.45:5000';
const today = new Date();
today.setDate(today.getDate() + 1)
today.setHours(-15, 0, 0, 0);
// 내일 날짜 계산
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);






// VAPID 키 설정
// const vapidKeys = {
//   publicKey: 'BO_7kvTYHEHOBhYNTO5hYfh5eXXhmIm5sfGnXHObB6TYyqpW4vffDSni1LMft8n6bRuvhSm7BsoYyr9pyP4j9vU',
//   privateKey: '7uVuIZ4uAewEfeZ_jRZnBUMAX3nHotVfwrIRS6ZP0c8',
// };
// webpush.setVapidDetails('mailto:youremail@example.com', vapidKeys.publicKey, vapidKeys.privateKey);

// const vapidKeys = webpush.generateVAPIDKeys();
// console.log('Public Key:', vapidKeys.publicKey);
// console.log('Private Key:', vapidKeys.privateKey);

// 푸시 알람 보내는 함수
// function sendPushNotification(subscription, message) {
//   webpush.sendNotification(subscription, JSON.stringify({ title: '화재 알림', body: message }))
//     .then(() => {
//       console.log('푸시 알람이 성공적으로 전송되었습니다.');
//     })
//     .catch((error) => {
//       console.error('푸시 알람 전송 오류:', error);
//     });
// }


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};


// 미들웨어 설정
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));

//mysql 연결 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'aistory2',
  password: 'aistory2',
  database: 'aistory',
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error: ', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});


// 클라이언트 연결 시 이벤트 처리
wss.on('connection', (ws) => {
  console.log('클라이언트가 연결되었습니다.');

  // 클라이언트로부터 메시지 수신 시 이벤트 처리
  ws.on('message', (message) => {
    console.log(`클라이언트로부터 받은 메시지: ${message}`);
  });

  // 클라이언트 연결 종료 시 이벤트 처리
  ws.on('close', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });
});





// 회원가입 라우트 
app.post('/signup', (req, res) => {
  const {name, phoneNumber, password, address, sensorNumber } = req.body;

  // 전화번호 중복 체크
  const checkPhoneNumberSql = 'SELECT phone_number FROM users WHERE phone_number = ?';
  connection.query(checkPhoneNumberSql, [phoneNumber], (checkErr, checkResult) => {
    if(checkErr) {
      console.error('Error checking phone number: ', checkErr);
      return res.status(500).json({ success: false, messgae: '서버 오류'});
    }
    if(checkResult.length > 0) {
      // 이미 가입된 전화번호
      return res.status(400).json({ success: false, message: '이미 가입된 전화번호입니다.'});
    }
  
     // 회원 정보 DB에 저장
    const insertsql = 'INSERT INTO users (id, name, phone_number, password, address, sensor_number) VALUES (?,?,?,?,?,?)';
    connection.query(insertsql, [phoneNumber, name, phoneNumber, password, address, sensorNumber], (insertErr, insertResult) =>{
      if (insertErr) {
        console.error('Error executing MySQL query: ', insertErr);
        return res.status(500).json({ success: false, message: '회원가입 실패'});
      } 
      res.json({success: true, message: '회원가입 성공'});
    });
  });
});


// 로그인 라우트
app.post('/login', (req, res) => {
  const{phoneNumber, password} = req.body;

  // 회원 정보 DB에서 조회
  const sql = 'SELECT * FROM users WHERE phone_number = ? AND password = ?';
  connection.query(sql, [phoneNumber, password], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ success: false, message : '로그인 실패'});
    } else {
      if (result.length === 0){
        res.json({success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.'});
      } else {
        res.json({ success: true, message:' 로그인 성공 '});
      }
    }
  });
});

// 사용자 정보 조회 라우트
app.get('/getUserInfo', (req, res) => {
  const phoneNumber = req.query.phoneNumber; // 클라이언트에서 전달된 전화번호

  // 회원 정보 DB에서 조회
  const sql = 'SELECT * FROM users WHERE phone_number = ?';
  connection.query(sql, [phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ success: false, message: '사용자 정보 조회 실패' });
    } else {
     // const user = result.find(item => item.phone_number === phoneNumber);
      //const user = result[0];
      if (result.length > 0) {
        const user = result[0];
        // console.log('사용자 정보조회 성공: ', user);
        res.json({ success: true, user: user });
      } else {
        res.json({ success: false, message: '사용자 정보가 없습니다.' });
      }
    }
  });

});

// allowSensor 확인 라우트
app.get('/checkAllowSensor/:sensorNumber', (req, res) => {
  const sensorNumber = req.params.sensorNumber;

  // allowSensor 테이블에서 확인
  const sql = 'SELECT COUNT(*) as count FROM allowSensor WHERE sensor_number = ?';
  connection.query(sql, [sensorNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ allowed: false });
    } else {
      const count = result[0].count;
      res.json({ allowed: count > 0 });
    }
  });
});

// 이미 사용 중인 sensorNumber 확인 라우트
app.get('/checkSensorAlreadyUsed/:sensorNumber', (req, res) => {
  const sensorNumber = req.params.sensorNumber;

  // users 테이블에서 확인
  const sql = 'SELECT COUNT(*) as count FROM users WHERE sensor_number = ?';
  connection.query(sql, [sensorNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ used: false });
    } else {
      const count = result[0].count;
      res.json({ used: count > 0 });
    }
  });
});

// 센서 번호 변경 라우트
app.post('/updateSensorNumber', (req, res) => {
  const { phoneNumber, newSensorNumber } = req.body;

  // 센서 번호가 allowSensor 테이블에 있는지 확인
  const checkSensorSql = 'SELECT * FROM allowSensor WHERE sensor_number = ?';
  connection.query(checkSensorSql, [newSensorNumber], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking sensor number: ', checkErr);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    if (checkResult.length === 0) {
      // 센서 번호가 allowSensor 테이블에 없음
      return res.status(400).json({ success: false, message: '존재하지 않는 센서 번호입니다.' });
    }
    // 이미 사용 중인 센서 번호 확인
    const checkUsedSql = 'SELECT COUNT(*) as count FROM users WHERE sensor_number = ? AND phone_number != ?';
    connection.query(checkUsedSql, [newSensorNumber, phoneNumber], (usedErr, usedResult) => {
      if (usedErr) {
        console.error('Error checking used sensor number: ', usedErr);
        return res.status(500).json({ success: false, message: '서버 오류' });
      }
      const count = usedResult[0].count;
      if (count > 0) {
        return res.status(400).json({ success: false, message: '이미 등록된 센서 번호입니다.' });
      }

    // 사용자 정보 업데이트
    const updateUserSql = 'UPDATE users SET sensor_number = ? WHERE phone_number = ?';
    connection.query(updateUserSql, [newSensorNumber, phoneNumber], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating sensor number: ', updateErr);
        return res.status(500).json({ success: false, message: '센서 정보 업데이트 실패' });
      }
      res.json({ success: true, message: '센서 정보 변경 성공' });
    });
  });
});
});

// 이미 사용 중인 전화번호 확인 라우트
app.get('/checkPhoneNumberInUse/:phoneNumber', (req, res) => {
  const phoneNumber = req.params.phoneNumber;

  // users 테이블에서 해당 전화번호를 사용하는 사용자 수 조회
  const sql = 'SELECT COUNT(*) as count FROM users WHERE phone_number = ?';
  connection.query(sql, [phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ used: false });
    } else {
      const count = result[0].count;
      res.json({ used: count > 0 });
    }
  });
});

// 사용자 이름 변경 라우트
app.post('/changeUserName', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // 클라이언트에서 전달된 전화번호
  const newName = req.body.newName; // 클라이언트에서 전달된 새로운 이름

  // 사용자 이름 업데이트
  const sql = 'UPDATE users SET name = ? WHERE phone_number = ?';
  connection.query(sql, [newName, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ success: false, message: '사용자 이름 변경 실패' });
    } else {
      res.json({ success: true, message: '사용자 이름 변경 성공' });
    }
  });
});

// 사용자 전화번호 변경 라우트
app.post('/changeUserPhoneNumber', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // 클라이언트에서 전달된 전화번호
  const newPhoneNumber = req.body.newPhoneNumber; // 클라이언트에서 전달된 새로운 전화번호

  // 사용자 전화번호 업데이트
  const sql = 'UPDATE users SET phone_number = ?, id = ? WHERE phone_number = ?';
  connection.query(sql, [newPhoneNumber, newPhoneNumber, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ success: false, message: '사용자 전화번호 변경 실패' });
    } else {
      res.json({ success: true, message: '사용자 전화번호 변경 성공' });
    }
  });
});

// 사용자 비밀번호 변경 라우트
app.post('/changeUserPassword', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // 클라이언트에서 전달된 전화번호
  const newPassword = req.body.newPassword; // 클라이언트에서 전달된 새로운 비밀번호

  // 사용자 비밀번호 업데이트
  const sql = 'UPDATE users SET password = ? WHERE phone_number = ?';
  connection.query(sql, [newPassword, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ success: false, message: '사용자 비밀번호 변경 실패' });
    } else {
      res.json({ success: true, message: '사용자 비밀번호 변경 성공' });
    }
  });
});

//------------------------------------------------------------------------------------------------------

// 사용자 주소지 변경 라우트
app.post('/changeUserAddress', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // 클라이언트에서 전달된 전화번호
  const newAddress = req.body.newAddress; // 클라이언트에서 전달된 새로운 주소

  // 사용자 주소 업데이트
  const sql = 'UPDATE users SET address = ? WHERE phone_number = ?';
  connection.query(sql, [newAddress, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).json({ success: false, message: '사용자 주소지 변경 실패' });
    } else {
      res.json({ success: true, message: '사용자 주소지 변경 성공' });
    }
  });
});


//------------------------------------------------------------------------------------------------------
//인공지능 확률 받아오기 - 그래프 


app.get('/aiData', (req, res) => {
  const phoneNumber = req.query.phoneNumber;

  // 사용자의 전화번호로 센서 번호를 검색
  const queryFindSensorNumber = 'SELECT sensor_number FROM users WHERE phone_number = ?';

  connection.query(queryFindSensorNumber, [phoneNumber], (err, userResult) => {
    if (err) {
      throw err;
    }

    if (userResult.length === 0) {
      
      return res.status(404).json({ error: 'User not found' });
    }

    const sensorNumber = userResult[0].sensor_number;
    // console.log(sensorNumber);

    // 검색된 센서 번호를 사용하여 AI 데이터를 가져오기
    const queryGetAiData = `SELECT * FROM ai WHERE sensor_number = ? 
    AND ai.timestamp >= '${today.toISOString()}' AND ai.timestamp < '${tomorrow.toISOString()}'`;

    connection.query(queryGetAiData, [sensorNumber], (err, aiDataResult) => {
      if (err) {
        console.error('Error querying AI data:', err);
        throw err; 
      }
      console.log('AI Data:', aiDataResult);
      res.json({ success: true, aiData: aiDataResult });
    });
  });
});


//------------------------------------------------------------------------------------------------------
// API 엔드포인트: 센서 데이터 가져오기
app.get('/sensorData', (req, res) => {
  const phoneNumber = req.query.phoneNumber; 
  
  const queryFindSensorNumber = 'SELECT sensor_number FROM users WHERE phone_number = ?';

  connection.query(queryFindSensorNumber, [phoneNumber], (err, userResult) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json({ error: '데이터베이스 오류' });
    }

    if (userResult.length === 0) {
      
      return res.status(404).json({ error: '사용자를 찾을 수 없음' });
    }

    const sensorNumber = userResult[0].sensor_number;
    // console.log('검색된 센서 번호:', sensorNumber);

    // 검색된 센서 번호를 사용하여 센서 데이터
    const queryGetSensorData = 'SELECT * FROM sensor_data WHERE sensor_number = ?';

    connection.query(queryGetSensorData, [sensorNumber], (err, sensorDataResult) => {
      if (err) {
        console.error('MySQL 쿼리 오류:', err);
        return res.status(500).json({ error: '데이터베이스 오류' });
      }
      // console.log('센서 데이터:', sensorDataResult);
      res.json({ success: true, sensorData: sensorDataResult });
    });
  });
});




//------------------------------------------------------------------------------------------------------
// 화재 발생 -> 소방청 웹사이트로 알림 제공
const today1 = new Date();
today.setDate(today.getDate() + 1)
today.setHours(-15, 0, 0, 0);
// 내일 날짜 계산
const tomorrow1 = new Date(today);
tomorrow.setDate(today.getDate() + 1);


console.log(today);
console.log(tomorrow);

// 화재 감지를 주기적으로 확인하고 알림 전송
// function checkFireAlert() {
//   const query = `
//     SELECT users.address
//     FROM users
//     JOIN sensor_data ON users.sensor_number = sensor_data.sensor_number
//     WHERE sensor_data.flame_sensor_value like 1
//     AND sensor_data.timestamp >= '${today.toISOString()}' AND sensor_data.timestamp < '${tomorrow.toISOString()}';
//   `;

let hasSentFireAlert = false; 

function checkFireAlert() {
  const query = `
    SELECT users.address
    FROM users
    JOIN sensor_data ON users.sensor_number = sensor_data.sensor_number
    JOIN ai ON users.sensor_number = ai.sensor_number
    WHERE sensor_data.flame_sensor_value = 1
      AND sensor_data.timestamp >= '${today.toISOString()}' AND sensor_data.timestamp < '${tomorrow.toISOString()}'
      AND ai.timestamp >= '${today.toISOString()}' AND ai.timestamp < '${tomorrow.toISOString()}'
      AND ai.ai_data >= 70;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('데이터베이스 오류:', error);
      return;
    }

    if (results.length > 0 && !hasSentFireAlert) {
      results.forEach((result) => {
        const userAddress = result.address;

        console.log('화재 감지');

        // 화재 알림을 전송
        console.log('화재발생 알림 전달');

        const fireAlertData = {
          alertMessage: '화재 발생!',
          userAddress: userAddress,
        };

        wss.clients.forEach((client) => {
          client.send(JSON.stringify(fireAlertData));
        });

        // 화재 알림을 보냈으므로 상태 변수 업데이트
    //     hasSentFireAlert = true;
      });
    // } else {
    //   // 화재 감지되지 않았거나 이미 알림을 보낸 경우에는 콘솔에 메시지 출력
    //   if (!hasSentFireAlert) {
    //     console.log('화재가 감지되지 않았습니다.');
    //   }
    }
  });
}

// 주기적으로 화재 감지 확인 
setInterval(checkFireAlert, 10000); // 1분 간격으로 실행


//------------------------------------------------------------------------------------------------------
// 아두이노 데이터를 저장하는 라우트
app.post('/recieve', (req, res) => {
  // 아두이노에서 보낸 데이터 파싱
  const { sensor_number, humidity, temperature, object_temp, ambient_temp, flame_sensor_value } = req.body;
  console.log(flame_sensor_value);
  // 데이터베이스에 데이터 삽입
  const sql = 'INSERT INTO sensor_data (sensor_number, humidity, temperature, object_temp, ambient_temp, flame_sensor_value, timestamp) VALUES (?, ?, ?, ?, ?, ?, default)';
  connection.query(sql, [sensor_number, humidity, temperature, object_temp, ambient_temp, flame_sensor_value], (err, result) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json({ success: false, error: '데이터베이스 오류' });
    }

    console.log('데이터베이스에 데이터 저장 완료');
    res.json({ success: true, message: '데이터 저장 성공' });

      });
});
  




//------------------------------------------------------------------------------------------------------
// 캘린더 센서 데이터 받아오기
// API 엔드포인트: 센서 데이터 가져오기
app.get('/senDataForDate', (req, res) => {
  const phoneNumber = req.query.phoneNumber; 
  const selectedDate = req.query.selectedDate;

  // 사용자의 전화번호로 센서 번호를 검색하는 쿼리
  const queryFindSensorNumber = 'SELECT sensor_number FROM users WHERE phone_number = ?';

  connection.query(queryFindSensorNumber, [phoneNumber], (err, userResult) => {
    if (err) {
      console.error('MySQL 쿼리 오류:', err);
      return res.status(500).json({ error: '데이터베이스 오류' });
    }

    if (userResult.length === 0) {
      
      return res.status(404).json({ error: '사용자를 찾을 수 없음' });
    }

    const sensorNumber = userResult[0].sensor_number;
    console.log('검색된 센서 번호:', sensorNumber);

    // 검색된 센서 번호를 사용하여 센서 데이터를 가져오는 쿼리
    const queryGetSensorData = 'SELECT * FROM sensor_data WHERE sensor_number = ? AND DATE(timestamp) = ?';

    connection.query(queryGetSensorData, [sensorNumber, selectedDate], (err, sensorDataResult) => {
      if (err) {
        console.error('MySQL 쿼리 오류:', err);
        // return res.status(500).json({ error: '데이터베이스 오류' });
      }
      // console.log('센서 데이터:', sensorDataResult);
      res.json({ success: true, sensorData: sensorDataResult });
    });
  });
});


//------------------------------------------------------------------------------------------------------
//****인공지능 퍼센트

// 인공지능 확률 받아오기 (마지막으로 삽입된 AI 데이터)
app.get('/aiTable', (req, res) => {
  const phoneNumber = req.query.phoneNumber;

  // 사용자의 전화번호로 센서 번호 검색
  const queryFindSensorNumber = 'SELECT sensor_number FROM users WHERE phone_number = ?';

  connection.query(queryFindSensorNumber, [phoneNumber], (err, userResult) => {
    if (err) {
      console.error('Error querying user data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (userResult.length === 0) {
      
      return res.status(404).json({ error: 'User not found' });
    }

    const sensorNumber = userResult[0].sensor_number;
    // console.log(sensorNumber);

    // 검색된 센서 번호를 사용하여 마지막으로 삽입된 AI 데이터
    const queryGetLastAiData = 'SELECT ai_data FROM ai WHERE sensor_number = ? ORDER BY id DESC LIMIT 1';

    connection.query(queryGetLastAiData, [sensorNumber], (err, aiDataResult) => {
      if (err) {
        console.error('Error querying AI data:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (aiDataResult.length === 0) {
        // AI 데이터를 찾을 수 없음
        return res.status(404).json({ error: 'AI data not found' });
      }

      const aiData = aiDataResult[0].ai_data;
      // console.log('AI Data:', aiData);

      res.json({ success: true, aiData });
    });
  });
});

// --------------------------------------------------------------------------------------------------------
//파이썬
// 보낼 데이터

// const sql = 'SELECT season, flame_sensor_value, humidity, object_temp, ambient_temp FROM sensor_data WHERE flame_sensor_value = 1';

// connection.query(sql, (error, results) => {
//   if (error) {
//     console.error('MySQL 쿼리 오류:', error);
//     return;
//   }

//   //  Python 서버로 보내기
//   const dataToSend = {
//     sensor_data: results, 
//   };

//   // POST 요청 보내기
//   axios.post(pythonServerURL + '/predict', dataToSend)
//     .then((response) => {
//       console.log('Python 서버 응답:', response.data);
//       // 여기에서 결과를 사용하거나 처리할 수 있음
//     })
//     .catch((error) => {
//       console.error('POST 요청 오류:', error);
//     });
// });

// 파이썬 서버에 주기적으로 데이터 전달
function fetchDataAndSendToPython() {
  const sql = 'SELECT season, flame_sensor_value, humidity, object_temp, ambient_temp FROM sensor_data  ORDER BY timestamp DESC LIMIT 1;';
  

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('MySQL 쿼리 오류:', error);
      return;
    }

    const dataToSend = {
      sensor_data: results,
    };

    // if (results[0].flame_sensor_value === 0) {
    //   dataToSend.sensor_data[0].ambient_temp = results[0].object_temp;
    // }

    axios
      .post(pythonServerURL + '/predict', dataToSend)
      .then((response) => {
        console.log('Python 서버 응답:', response.data);
        
      })
      .catch((error) => {
        console.error('POST 요청 오류:', error);
      });
  });
}

// 데이터 제공 및 요청 간격 
setInterval(fetchDataAndSendToPython, 10000); // (10초)

//-------------------------------------------------------------------------------


function fetchDataAndCheckDifference() {
  // 최신 데이터 가져오기
  const latestDataQuery = 'SELECT timestamp, ambient_temp FROM sensor_data ORDER BY timestamp DESC LIMIT 1';
  connection.query(latestDataQuery, (err, results) => {
    if (err) {
      console.error('데이터 조회 중 오류 발생: ', err);
      return;
    }

    if (results.length > 0) {
      const { timestamp, ambient_temp } = results[0];
      checkTemperatureDifference(timestamp, ambient_temp);
    }
  });
}

let hasSentTempAlert = false; 

function checkTemperatureDifference(currentTimestamp, currentAmbientTemp) {
  // 이전 timestamp 가져오기
  const previousDataQuery = 'SELECT timestamp, ambient_temp FROM sensor_data WHERE timestamp < ? ORDER BY timestamp DESC LIMIT 1';
  connection.query(previousDataQuery, [currentTimestamp], (err, results) => {
    if (err) {
      console.error('이전 데이터 조회 중 오류 발생: ', err);
      return;
    }

    if (results.length > 0) {
      const { timestamp, ambient_temp: previousAmbientTemp } = results[0];
      const tempDifference = currentAmbientTemp - previousAmbientTemp;

      if (tempDifference >= 10 && !hasSentTempAlert) {
        // console.log(`경고: ${currentTimestamp}에 측정된 Ambient Temp가 직전과 10도 이상 차이가 납니다!`);

        // WebSocket을 통해 클라이언트에 경고 메시지 전송
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const tempAlertData = {
              alertMessage: '발열량 이상 발견',
            };

            client.send(JSON.stringify(tempAlertData));
          }
        });

        // 경고를 보냈으므로 상태 변수를 업데이트하여 다음에는 보내지 않도록 함
        hasSentTempAlert = true;
      } else {
        // 경고를 보내지 않은 경우에는 상태 변수를 초기화
        hasSentTempAlert = false;
      }
    }
  });
}

// 5초에 한 번씩 주기적으로 작업 실행
setInterval(fetchDataAndCheckDifference, 10000);

// 초기 실행
// fetchDataAndCheckDifference();




// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
