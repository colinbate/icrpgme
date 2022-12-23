import { _getBaseMessageData } from './chat-common.js';

async function _renderRollMessage(messageData, context = {}) {
  const rolls = messageData.rolls;
  if (rolls && game.dice3d) {
    for (let roll of rolls) {
      await game.dice3d.showForRoll(roll, game.user, true, messageData.whisper, messageData.blind);
    }
  }
  return ChatMessage.create(messageData, context);
}

export async function postRollMessage(actor, roll, context = { temporary: false }, messageData = {}) {
  if (!roll._evaluated) await roll.roll({ async: true });

  // Prepare chat data
  messageData = mergeObject(_getBaseMessageData(actor, [roll]), messageData);
  messageData.content = await renderTemplate('systems/icrpgme/templates/chat/roll.html', {
    actor: actor,
    roll: roll,
    messageData: messageData,
  });

  return _renderRollMessage(messageData, context);
}
