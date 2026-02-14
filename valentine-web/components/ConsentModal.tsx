import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ShieldCheck, Smartphone, MapPin, Globe, Monitor } from 'lucide-react';
import { useState } from 'react';

interface ConsentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConsentModal({ isOpen, onClose, onConfirm }: ConsentModalProps) {
    const [checked, setChecked] = useState(false);

    const handleConfirm = () => {
        if (checked) onConfirm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transparency Check"
            footer={
                <div className="flex flex-col gap-4 w-full">
                    <label className="flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-rose/5 transition-colors">
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-rose-600 focus:ring-rose-500 rounded border-gray-300"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                        <span className="text-sm text-charcoal/90">
                            I understand that my device information will be shared with the creator to prevent abuse.
                        </span>
                    </label>
                    <Button
                        onClick={handleConfirm}
                        disabled={!checked}
                        variant="primary"
                        className="w-full"
                    >
                        Send My Message
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Valentine is a <strong>public-anonymous</strong> platform. To ensure safety and prevent harassment, the following information from your device will be visible to the recipient:
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-charcoal/80 bg-rose/5 p-4 rounded-xl border border-rose/10">
                    <div className="flex items-center gap-2">
                        <Smartphone size={16} className="text-rose-500" />
                        <span>Device Model</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-rose-500" />
                        <span>City Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-rose-500" />
                        <span>Timezone</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Monitor size={16} className="text-rose-500" />
                        <span>Screen Size</span>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <p>
                        We <strong>never</strong> store your raw IP address. It is hashed for safety. The recipient cannot see exactly who you are, only your device footprint.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
