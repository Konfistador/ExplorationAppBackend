import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';
import {ApnService} from './apn.service';
import * as apn from 'apn';
import {ScheduledNotificationRepository, UserAccountRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {ScheduledNotification} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationService {
  constructor(
    @repository(UserAccountRepository)
    private userAccountRepository: UserAccountRepository,
    @repository(ScheduledNotificationRepository)
    private scheduledNotifRepository: ScheduledNotificationRepository,
    @service(ApnService)
    private apnService: ApnService,
  ) {
  }

  async notifyUser(userId: number, message: string): Promise<void> {
    const user = await this.userAccountRepository.findById(userId);
    if (user) {
      const notif = this.createAPNNotif(message);
      await this.apnService.send(notif, user.deviceToken);
    }
  }
  async notifyAllUsers(message : string): Promise<void>{
    const users = await this.userAccountRepository.find();
    const notif = this.createAPNNotif(message);
    for( const user of users){
      await this.apnService.send(notif,user.deviceToken);
    }
  }

  async scheduleNotification(userId: number, message: string, sendAt: Date): Promise<void>{
    const user = await this.userAccountRepository.findById(userId);
    if(user){
      const notif = new ScheduledNotification({
        deviceToken: user.deviceToken,
        message: message,
        sendAt: sendAt.toISOString(),
      });
      await this.scheduledNotifRepository.create(notif);
    }
  }

  async processScheduledNotifications(): Promise<void>{
    const notifications = await this.scheduledNotifRepository.find({
      where: {
        and: [{sendAt: {lte: new Date().toISOString()}}, {sent: false}],
      },
    });
    for (const notif of notifications) {
      const apnNotif =  this.createAPNNotif(notif.message);
      await this.apnService.send(apnNotif,notif.deviceToken);
      notif.sent = true;
      await this.scheduledNotifRepository.update(notif);
    }
  }

  private createAPNNotif(message: string): apn.Notification{
  const notif = new apn.Notification();
  notif.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  notif.badge = 5;
  notif.sound = "ping.aiff";
  notif.alert = message;
  notif.payload = {'Hello from': 'Path'};
  notif.topic = "nl.fontys.prj423.group8";

  return notif;
  }
}
