import { Logger } from "@nestjs/common";

const logger = new Logger("SocketEvent");

export function LogSocketEvent() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [_, payload] = args;
      logger.log(`[Socket Event] ${key} - Data: ${JSON.stringify(payload, undefined, 4)}`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
