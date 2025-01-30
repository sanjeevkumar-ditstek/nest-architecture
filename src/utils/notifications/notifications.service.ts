// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendToSingleDevice(token: string, title: string, body: string) {
    const payload = {
      notification: {
        title,
        body,
      },
    };
    return this.firebaseService.sendToDevice(token, payload);
  }
  
//   async sendToMultipleDevices(tokens: string[], title: string, body: string) {
//     const payload = {
//       notification: {
//         title,
//         body,
//       },
//     };
//     return this.firebaseService.sendToDevice(tokens, payload);
//   }

  async sendToTopic(topic: string, title: string, body: string) {
    const payload = {
      notification: {
        title,
        body,
      },
    };
    return this.firebaseService.sendToTopic(topic, payload);
  }
}
