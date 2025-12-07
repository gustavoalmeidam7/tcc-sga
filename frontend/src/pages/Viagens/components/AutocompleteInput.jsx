import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export function AutocompleteInput({
  id,
  label,
  icon: Icon,
  iconColor,
  placeholder,
  value,
  onChange,
  onKeyDown,
  onFocus,
  sugestoes,
  showSugestoes,
  onSugestaoClick,
  inputRef,
  borderColor,
}) {
  return (
    <div className="space-y-2 relative" ref={inputRef}>
      <Label htmlFor={id} className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {label}
      </Label>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className={`border-2 ${borderColor}`}
      />
      <AnimatePresence>
        {showSugestoes && sugestoes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-card border-2 border-primary/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
          >
            {sugestoes.map((sugestao, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-4 py-3 cursor-pointer hover:bg-primary/10 transition-all border-b border-border last:border-b-0"
                onClick={() => onSugestaoClick(sugestao)}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-start gap-2">
                  <Icon className={`h-4 w-4 mt-1 ${iconColor} flex-shrink-0`} />
                  <p className="text-sm text-foreground">{sugestao.nome}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
