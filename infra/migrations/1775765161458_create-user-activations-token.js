exports.up = (pgm) => {
  pgm.createTable("user_activations_tokens", {
    id: {
      type: "uuid",
      primaryKey: true, // define a coluna como identificador principal da tabela
      default: pgm.func("gen_random_uuid()"),
    },

    used_at: {
        type: "timestamptz",
        notNull: false,
    },

    user_id: {
      type: "uuid",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
