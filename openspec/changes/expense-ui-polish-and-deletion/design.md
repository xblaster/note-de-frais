# Design: Expense UI Polish and Deletion

## Architecture

### Backend: Expense Deletion
The backend will use Prisma to remove the record.
- **Service**: 
  ```typescript
  async remove(id: string, userId: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense || expense.userId !== userId) throw new NotFoundException();
    // (Optional) if (expense.status !== 'DRAFT' && expense.status !== 'REJECTED') throw new Error('Cannot delete');
    return this.prisma.expense.delete({ where: { id } });
  }
  ```
- **Controller**:
  ```typescript
  @Delete(':id')
  async remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.expensesService.remove(id, userId);
  }
  ```

### Frontend: Session Management
To avoid redirecting to login if already authenticated:
- **App Routes**:
  ```typescript
  const userId = localStorage.getItem('userId');
  // ...
  <Route path="/" element={userId ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
  ```
- **LoginPage**: Check session on mount and navigate if present.

### Frontend: Deletion UI
- **ExpenseCard**: Add a small `Trash2` button from Lucide.
- **Confirmation**: Use a simple `window.confirm` or a small inline confirmation to avoid accidental deletion.

### Data Flow
- Remove the `createMany` dummy logic from `ExpensesService.findAll`.
- The list will be empty if the user hasn't created any real expenses yet.
