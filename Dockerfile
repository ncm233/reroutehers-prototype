# ---- build stage: generate site/index.html from source at image-build time ----
FROM node:20-alpine AS build
WORKDIR /app
COPY assemble-app.mjs _merged.css ./
RUN node assemble-app.mjs

# ---- runtime stage: serve the built site via a small dynamic Node server ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY server.mjs package.json ./
COPY --from=build /app/site ./site

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
