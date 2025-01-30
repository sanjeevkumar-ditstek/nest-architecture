// src/notifications/firebase.service.ts
import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp({
      //credential: admin.credential.cert(''),
      // Add your databaseURL if required
    });
  }

  public async sendToDevice(token: string, payload: admin.messaging.MessagingPayload) {
    return await admin.messaging().send ({
        notification: {
          title: payload.notification.title,
          body: payload.notification.body,
        },
        token: token,
        data: {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              contentAvailable: true,
              sound: 'default',
            },
          },
        },
      });
  }

  public async sendToTopic(topic: string, payload: admin.messaging.MessagingPayload) {
    return await admin.messaging().sendToTopic(topic, payload);
  }
}
