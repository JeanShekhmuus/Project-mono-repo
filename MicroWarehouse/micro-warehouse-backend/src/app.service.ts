import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import subscription from './modules/builder/subscription';

@Injectable()
export class AppService {
  
  constructor(
    private readonly modelBuilderService: BuilderService,
  ) {}

  
  async handlePickDone(params: any) {
    await this.modelBuilderService.handlePickDone(params);
    return 200;
  }

  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productOrdered') {
      return await this.modelBuilderService.handleProductOrdered(event);
    }

    return {error: 'shop backend does not know how to handle ' + event.eventType};
  }

  async getQuery(key: string): Promise<any> {
    console.log(`appService getQuery start`);
    const list =  await this.modelBuilderService.getByTag(key);
    const answer = {
      key: key,
      result: list,
    };

    console.log(`appService getQuery end`)
    return answer;
  }

  async handleCommand(command: Command) {
    // console.log(`AppService.handleComman got again ${JSON.stringify(command, null, 3)}`);
    if (command.opCode === 'storePalette') {
      await this.modelBuilderService.storePalette(command.parameters);
      return command;
    } else {
      return {
        error: `cannot handle ${command.opCode}`
      }
    }
  }

  async handleSubscription(subscription: subscription) {
    return await this.modelBuilderService.handleSubscription(subscription)
  }

  getHello(): string {
    return "Hello Course!";
  }
}
