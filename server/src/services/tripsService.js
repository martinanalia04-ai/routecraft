let db = []; // Mock de base de datos
exports.findAll = () => db;
exports.create = (data) => {
    const item = { id: Date.now().toString(), ...data };
    db.push(item);
    return item;
};
exports.delete = (id) => {
    db = db.filter(r => r.id !== id);
    return true;
};