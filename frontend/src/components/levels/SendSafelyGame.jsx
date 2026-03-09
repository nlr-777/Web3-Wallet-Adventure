import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

const ADDRESSES = [
  {
    id: 1,
    address: '0xScammer...FAKE',
    label: 'RandomUser123',
    isScammer: true,
    warning: 'This address looks suspicious! The label doesn\'t match who you want to send to.'
  },
  {
    id: 2,
    address: '0xTrustedFriend...REAL',
    label: 'TrustedBuddy',
    isScammer: false,
    warning: null
  },
  {
    id: 3,
    address: '0xPhisher...TRAP',
    label: 'Definitely_Not_Scam',
    isScammer: true,
    warning: 'The name "Definitely_Not_Scam" is a red flag! Real friends don\'t need to say that.'
  }
];

export default function SendSafelyGame({ level, onComplete }) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [coins] = useState(50);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowWarning(false);
  };

  const handleSend = () => {
    if (!selectedAddress) {
      toast.error('Please select an address first!');
      return;
    }

    if (selectedAddress.isScammer) {
      setShowWarning(true);
      toast.error('⚠️ Warning! This might be a scammer!');
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success(`🎉 Coins sent safely! +${level.xp} XP | Badge: ${level.badge}`);
      setTimeout(() => {
        onComplete({ id: level.id, xp: level.xp, badge: level.badge });
      }, 2000);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Send Coins to Your Friend</h2>
        <p className="text-muted-foreground text-sm">Choose the correct address - watch out for scammers!</p>
        <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-lg px-4 py-2 border-2 border-secondary/30">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold text-foreground">{coins} Coins</span>
        </div>
      </div>

      {/* Friend Info */}
      <Card className="p-4 bg-primary/5 border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🧑‍🤝‍🧑</div>
          <div>
            <p className="font-bold text-foreground">Sending to: TrustedBuddy</p>
            <p className="text-sm text-muted-foreground">Your real friend from BlockQuest!</p>
          </div>
        </div>
      </Card>

      {/* Address Options */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">Select the correct address:</p>
        {ADDRESSES.map((address) => (
          <motion.div
            key={address.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border-2 border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelectAddress(address)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">{address.label}</span>
                    {address.isScammer && (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <code className="text-sm text-muted-foreground font-mono break-all">
                    {address.address}
                  </code>
                </div>
                {selectedAddress?.id === address.id && (
                  <CheckCircle className="w-6 h-6 text-primary ml-3" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Warning Message */}
      {showWarning && selectedAddress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-destructive/10 border-2 border-destructive/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-destructive mb-2">Scammer Alert!</p>
                <p className="text-sm text-foreground/80">{selectedAddress.warning}</p>
                <p className="text-sm text-foreground/80 mt-2 font-semibold">
                  🛡️ Try selecting a different address!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Safety Tips */}
      <Card className="p-4 bg-accent/10 border-2 border-accent/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="font-bold text-accent text-sm">Safety Checklist:</p>
            <ul className="text-xs space-y-1 text-foreground/80">
              <li>• Always double-check the address before sending</li>
              <li>• Look for suspicious names or unusual characters</li>
              <li>• Verify with your friend through another way if unsure</li>
              <li>• Scammers often use names that look almost right!</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={!selectedAddress}
        className="w-full btn-adventure text-lg"
        size="lg"
        style={{ background: 'var(--gradient-button)' }}
      >
        📤 Send {coins} Coins
      </Button>
    </Card>
  );
}