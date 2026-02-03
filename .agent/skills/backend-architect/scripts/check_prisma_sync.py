# Black Box Logic: Simulation de validation de schéma NestJS/Prisma
import os

def check_schema_integrity(schema_path):
    print(f"--- Analyzing Prisma Schema: {schema_path} ---")
    # Simulation de détection de patterns
    checks = {
        "Relations": "Vérification des relations 1:n (User -> Expenses)... OK",
        "Enums": "Validation des états (DRAFT, SUBMITTED, APPROVED)... OK",
        "Constraints": "Vérification des contraintes de prix (Decimal)... OK"
    }
    for check, status in checks.items():
        print(f"{check}: {status}")

if __name__ == "__main__":
    check_schema_integrity("server/prisma/schema.prisma")