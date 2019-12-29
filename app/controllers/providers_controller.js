const Provider = require('../models/provider');
const Slot = require('../models/slot').Slot;
const statuses = require('../models/slot').statuses;
const moment = require('moment');

class ProvidersController {
    static async show(request, response) {
        await Provider.connect();
        const provider = await Provider.find(request.params.providerId);

        const appointmentSlotDuration = 30;
        const totalWorkingHours = 12;
        const totalWorkingMinutes = totalWorkingHours * 60;
        const totalAvailableAppointmentSlots = totalWorkingMinutes / appointmentSlotDuration;
        const startTime = moment('09:00', 'HH:mm')
        var slots = []
        for (var i = 0; i < totalAvailableAppointmentSlots; i++) {
            const startTimeStr = startTime.format('HH:mm')
            const endTimeStr = startTime.add(appointmentSlotDuration, 'minutes').format('HH:mm')
            const providerSlot = provider.slots.filter((slot) => {
                return moment(slot.startTime, 'HH:mm').format('HH:mm') == startTimeStr
            })[0];
            if (providerSlot) {
                const slotObj = new Slot(provider.id, providerSlot)
                slots.push({
                    _id: slotObj._id,
                    startTime: slotObj.startTime,
                    endTime: slotObj.endTime,
                    status: slotObj.getStatus()
                });
            } else {
                slots.push({
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    status: statuses.UN_AVAILABLE,
                });
            }
        }
        response.render('../views/providers/index', {
            provider,
            slots,
        });
    }
}

module.exports = ProvidersController;