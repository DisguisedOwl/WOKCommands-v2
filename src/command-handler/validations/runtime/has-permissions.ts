import { PermissionFlagsBits } from "discord.js";

import requiredPermissions from "../../../models/required-permissions-schema";
import Command from "../../Command";
import { CommandUsage } from "../../../../typings";

const keys = Object.keys(PermissionFlagsBits);

export default async (command: Command, usage: CommandUsage) => {
  const { permissions = [] } = command.commandObject;
  const { instance, guild, member, message, interaction } = usage;

  if (!member) {
    return true;
  }

  const document = await requiredPermissions.findById(
    `${guild!.id}-${command.commandName}`
  );
  if (document) {
    for (const permission of document.permissions) {
      if (!permissions.includes(permission)) {
        permissions.push(permission);
      }
    }
  }

  if (permissions.length) {
    const missingPermissions = [];

    for (const permission of permissions) {
      if (!member.permissions.has(permission)) {
        missingPermissions.push(permission);
      }
    }

    if (missingPermissions.length) {
      const text = `You are missing the permissions to run this command.`;

      if (message) message.reply(text);
      else if (interaction) interaction.reply(text);

      return false;
    }
  }

  return true;
};
