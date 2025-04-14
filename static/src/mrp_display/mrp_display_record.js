import { MrpDisplayRecord } from "@mrp_workorder/mrp_display/mrp_display_record";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";



patch(MrpDisplayRecord.prototype, {
    async validate() {
        const { resModel, resId } = this.props.record;
        if (resModel === "mrp.workorder") {
            if (this.record.state === "ready" && this.record.qty_producing === 0) {
                this.props.record.update({ qty_producing: this.record.qty_production });
            }
            this.validatingEmployee = this.props.sessionOwner.id;
            if (this.props.record.data.employee_ids.records.some((emp) => emp.resId == this.validatingEmployee)) {
                await this.model.orm.call(resModel, "stop_employee", [resId, [this.validatingEmployee]]);
                await this.props.record.load();
            }
            await this.props.record.save();
            const action = await this.model.orm.call(resModel, "pre_record_production", [resId]);
            if (action && typeof action === "object") {
                action.context.skip_redirection = true;
                return this._doAction(action);
            }
        }
        if (resModel === "mrp.production") {
            const args = [this.props.production.resId];
            const params = {};
            params.context = { skip_redirection: true };            
            let methodName = "pre_button_mark_done";
            if (this.trackingMode === "mass_produce") {
                methodName = "action_mass_produce";
            }
            const action = await this.model.orm.call("mrp.production", methodName, args, params);
            // If there is a wizard while trying to mark as done the production, confirming the
            // wizard will straight mark the MO as done without the confirmation delay.
            if (action && typeof action === "object") {
                action.context.skip_redirection = true;
                return this._doAction(action);
            }
        }
        // Makes the validation taking a little amount of time (see o_fadeout_animation CSS class).
        this.props.addToValidationStack(this.props.record, () => this.realValidation());
        this.state.underValidation = true;
    
    },
})