"""empty message

Revision ID: cf975ebc9770
Revises: 
Create Date: 2024-11-18 19:31:13.686670

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cf975ebc9770'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('institutions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('yapily_id', sa.String(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('icon', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('icon'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('yapily_id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('first_name', sa.String(length=80), nullable=True),
    sa.Column('last_name', sa.String(length=80), nullable=True),
    sa.Column('phone_number', sa.String(), nullable=True),
    sa.Column('photo_url', sa.String(), nullable=True),
    sa.Column('yapily_username', sa.String(), nullable=True),
    sa.Column('yapily_id', sa.String(), nullable=True),
    sa.Column('reset_token', sa.String(length=64), nullable=True),
    sa.Column('token_expiration', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('yapily_id'),
    sa.UniqueConstraint('yapily_username')
    )
    op.create_table('balances',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('total_balance', sa.Float(), nullable=False),
    sa.Column('monthly_expenses', sa.Float(), nullable=False),
    sa.Column('monthly_income', sa.Float(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('connections',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('consent_token', sa.String(length=600), nullable=True),
    sa.Column('institution_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['institution_id'], ['institutions.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('consent_token')
    )
    op.create_table('budgets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('budget_amount', sa.Float(), nullable=False),
    sa.Column('target_period', sa.DateTime(), nullable=False),
    sa.Column('total_expense', sa.Float(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('fixed_expenses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('expected_amount', sa.Float(), nullable=False),
    sa.Column('real_amount', sa.Float(), nullable=False),
    sa.Column('period', sa.String(), nullable=False),
    sa.Column('next_date', sa.DateTime(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.Column('is_active_next_period', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sources',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('yapily_id', sa.String(), nullable=True),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('type_source', sa.Enum('bank_account', 'manual_entry', 'credit_card', 'debit_card', 'others', name='type_source'), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('connection_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['connection_id'], ['connections.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('yapily_id', sa.String(), nullable=True),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('type', sa.Enum('income', 'expense', name='type'), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('source_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['source_id'], ['sources.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transactions')
    op.drop_table('sources')
    op.drop_table('fixed_expenses')
    op.drop_table('budgets')
    op.drop_table('connections')
    op.drop_table('categories')
    op.drop_table('balances')
    op.drop_table('users')
    op.drop_table('institutions')
    # ### end Alembic commands ###
